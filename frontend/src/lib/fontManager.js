import {
  hasFont,
  getFont,
  storeFont,
  updateFontLastUsed,
  deleteFont,
  getAllFonts,
  getFontsByIds,
  getStorageStats,
  setMaxStorage,
  deleteFontDB
} from './localDB/fontDB';
import { fetchFontList, getFontUrl } from '../hooks/fontApi';



/**
 * Font Manager Service
 * Centralized service for font caching, downloading, and management
 */
class FontManager {
  constructor() {
    this.blobUrls = new Map(); // Track blob URLs for cleanup
    this.loadingPromises = new Map(); // Prevent duplicate downloads
    this.fontListCache = null; // Cache font list from backend
    this.fontListCacheExpiry = null;
  }

  /**
   * Get font list from backend with caching
   */
  async getFontList(forceRefresh = false) {
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (!forceRefresh && this.fontListCache && this.fontListCacheExpiry > now) {
      return this.fontListCache;
    }

    try {
      this.fontListCache = await fetchFontList();
      this.fontListCacheExpiry = now + CACHE_DURATION;
      return this.fontListCache;
    } catch (error) {
      console.error('Error fetching font list:', error);
      // Return cached list if available, even if expired
      if (this.fontListCache) {
        return this.fontListCache;
      }
      throw error;
    }
  }

  /**
   * Get font info by ID
   */
  async getFontInfo(fontId) {
    const fontList = await this.getFontList();
    return fontList.find(font => font.id === fontId);
  }

  /**
   * Check if font is cached and valid
   */
  async isFontCached(fontId) {
    try {
      // Get font info from backend first
      const fontInfo = await this.getFontInfo(fontId);
      if (!fontInfo) {
        console.warn(`Font ${fontId} no longer exists in backend`);
        return false;
      }

      // Check if font exists in cache (readonly)
      const cachedFont = await getFont(fontId);
      if (!cachedFont) return false;

      // Check version and hash (normalize to uppercase)
      const cachedHash = cachedFont.hash ? cachedFont.hash.toUpperCase() : '';
      const expectedHash = fontInfo.hash ? fontInfo.hash.toUpperCase() : '';

      if (cachedFont.version !== fontInfo.version || (expectedHash && cachedHash !== expectedHash)) {
        console.info(`Font ${fontId} outdated, will re-download`);
        // Remove in separate transaction to avoid mixing readonly/readwrite
        setTimeout(() => this.removeFont(fontId), 0);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error checking cache for font ${fontId}:`, error);
      return false;
    }
  }

  /**
   * Download and cache font
   */
  async downloadFont(fontId) {
    // Prevent duplicate downloads
    if (this.loadingPromises.has(fontId)) {
      return this.loadingPromises.get(fontId);
    }

    const downloadPromise = this._downloadFontInternal(fontId);
    this.loadingPromises.set(fontId, downloadPromise);

    try {
      const result = await downloadPromise;
      return result;
    } finally {
      this.loadingPromises.delete(fontId);
    }
  }

  /**
   * Internal font download implementation
   */
  async _downloadFontInternal(fontId) {
    try {
      // Get font info
      const fontInfo = await this.getFontInfo(fontId);
      if (!fontInfo) {
        throw new Error(`Font ${fontId} not found in backend`);
      }

      // Get font URL
      const fontUrl = await getFontUrl(fontId);

      // Download font file
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`Failed to download font ${fontId}: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Verify size and hash
      if (blob.size === 0) {
        throw new Error(`Downloaded font ${fontId} is empty`);
      }

      // Calculate hash for verification
      const arrayBuffer = await blob.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // Normalize both hashes to uppercase for comparison
      const expectedHash = fontInfo.hash ? fontInfo.hash.toUpperCase() : '';

      console.log(`Font ${fontId} - Calculated hash: ${calculatedHash}, Expected hash: ${expectedHash}`);

      if (expectedHash && calculatedHash !== expectedHash) {
        throw new Error(`Font ${fontId} integrity check failed`);
      }

      // Create font record
      const fontRecord = {
        id: fontId,
        name: fontInfo.name,
        version: fontInfo.version,
        hash: fontInfo.hash,
        blob: blob,
        blobUrl: null, // Will be created on demand
        lastUsed: Date.now(),
        downloadedAt: Date.now(),
        size: blob.size
      };

      // Check storage quota before storing
      await this.ensureStorageQuota(fontRecord.size);

      // Store in IndexedDB
      await storeFont(fontRecord);

      console.info(`Font ${fontId} downloaded and cached successfully`);
      return fontRecord;

    } catch (error) {
      console.error(`Error downloading font ${fontId}:`, error);
      throw error;
    }
  }

  /**
   * Ensure storage quota is not exceeded
   */
  async ensureStorageQuota(requiredSize) {
    const stats = await getStorageStats();

    if (stats.totalSize + requiredSize <= stats.maxStorage) {
      return; // Enough space
    }

    // Need to free up space - use LRU eviction
    const fonts = await getAllFonts();
    fonts.sort((a, b) => a.lastUsed - b.lastUsed); // Oldest first

    let freedSpace = 0;
    const toDelete = [];

    for (const font of fonts) {
      if (stats.totalSize + requiredSize - freedSpace <= stats.maxStorage) {
        break;
      }
      toDelete.push(font.id);
      freedSpace += font.size;
    }

    // Delete oldest fonts
    for (const fontId of toDelete) {
      console.info(`Evicting font ${fontId} to free up space`);
      await this.removeFont(fontId);
    }

    // Check again after eviction
    const newStats = await getStorageStats();
    if (newStats.totalSize + requiredSize > newStats.maxStorage) {
      throw new Error(`Insufficient storage space. Required: ${requiredSize} bytes, Available: ${newStats.maxStorage - newStats.totalSize} bytes`);
    }
  }

  /**
   * Get or create blob URL for font
   */
  async getFontBlobUrl(fontId) {
    // Check if we already have a blob URL for this font
    if (this.blobUrls.has(fontId)) {
      const existingUrl = this.blobUrls.get(fontId);
      // Update last used timestamp
      await updateFontLastUsed(fontId);
      return existingUrl;
    }

    // Get font from cache
    const cachedFont = await getFont(fontId);
    if (!cachedFont) {
      throw new Error(`Font ${fontId} not found in cache`);
    }

    // Create blob URL
    const blobUrl = URL.createObjectURL(cachedFont.blob);
    this.blobUrls.set(fontId, blobUrl);

    // Update last used timestamp
    await updateFontLastUsed(fontId);

    return blobUrl;
  }

  /**
   * Load font into DOM using FontFace API
   */
  async loadFont(fontId) {
    try {
      // Ensure font is cached
      const isCached = await this.isFontCached(fontId);
      if (!isCached) {
        await this.downloadFont(fontId);
      }

      // Get blob URL
      const blobUrl = await this.getFontBlobUrl(fontId);

      // Check if font is already loaded in DOM
      const existingFont = Array.from(document.fonts).find(font =>
        font.family === fontId && font.status === 'loaded'
      );

      if (existingFont) {
        console.debug(`Font ${fontId} already loaded in DOM`);
        return fontId;
      }

      // Create FontFace
      const fontFace = new FontFace(
        fontId, // Use font ID as family name
        `url(${blobUrl})`,
        {
          display: 'swap',
          weight: 'normal',
          style: 'normal'
        }
      );

      // Add to document fonts
      document.fonts.add(fontFace);

      // Load font
      await fontFace.load();

      return fontId;

    } catch (error) {
      console.error(`Error loading font ${fontId}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple fonts in parallel
   */
  async loadFonts(fontIds) {
    const promises = fontIds.map(fontId => this.loadFont(fontId));
    return await Promise.allSettled(promises);
  }

  /**
   * Remove font from cache and cleanup
   */
  async removeFont(fontId) {
    try {
      // Revoke blob URL if exists
      if (this.blobUrls.has(fontId)) {
        URL.revokeObjectURL(this.blobUrls.get(fontId));
        this.blobUrls.delete(fontId);
      }

      // Remove from IndexedDB
      await deleteFont(fontId);

    } catch (error) {
      console.error(`Error removing font ${fontId}:`, error);
    }
  }

  /**
   * Get font loading status
   */
  async getFontStatus(fontId) {
    const isCached = await this.isFontCached(fontId);
    const isLoaded = Array.from(document.fonts).some(font =>
      font.family === fontId && font.status === 'loaded'
    );

    return {
      cached: isCached,
      loaded: isLoaded,
      blobUrl: this.blobUrls.get(fontId) || null
    };
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    return await getStorageStats();
  }

  /**
   * Set maximum storage limit
   */
  async setMaxStorage(maxBytes) {
    await setMaxStorage(maxBytes);
  }

  /**
   * Clear all cached fonts
   */
  async clearCache() {
    // Revoke all blob URLs
    for (const [fontId, blobUrl] of this.blobUrls) {
      URL.revokeObjectURL(blobUrl);
    }
    this.blobUrls.clear();

    // Clear IndexedDB
    const { clearAllFonts } = await import('./localDB/fontDB');
    await clearAllFonts();

    // Clear font list cache
    this.fontListCache = null;
    this.fontListCacheExpiry = null;

    console.info('Font cache cleared');
  }

  /**
   * Cleanup blob URLs for fonts not recently used
   */
  cleanupBlobUrls(maxAge = 30 * 60 * 1000) { // 30 minutes default
    const now = Date.now();
    const toRemove = [];

    for (const [fontId, blobUrl] of this.blobUrls) {
      // Check if font was used recently
      getFont(fontId).then(font => {
        if (!font || (now - font.lastUsed) > maxAge) {
          URL.revokeObjectURL(blobUrl);
          toRemove.push(fontId);
        }
      }).catch(() => {
        // Font not found, clean up
        URL.revokeObjectURL(blobUrl);
        toRemove.push(fontId);
      });
    }

    toRemove.forEach(fontId => this.blobUrls.delete(fontId));

    if (toRemove.length > 0) {
      console.debug(`Cleaned up ${toRemove.length} unused blob URLs`);
    }
  }

  /**
   * Initialize cleanup interval
   */
  startCleanupInterval(interval = 15 * 60 * 1000) { // 15 minutes default
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupBlobUrls();
    }, interval);
  }

  /**
   * Stop cleanup interval
   */
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
const fontManager = new FontManager();

// Start cleanup interval
fontManager.startCleanupInterval();

export default fontManager;