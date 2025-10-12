import { openDB, deleteDB } from 'idb';

/**
 * Font Database Manager for IndexedDB-based font caching
 * Optimized version with improved error handling and performance
 */

// Configuration constants
const CONFIG = {
  DB_NAME: 'fontDB',
  DB_VERSION: 1,
  STORES: {
    FONTS: 'fonts',
    METADATA: 'metadata'
  },
  DEFAULT_MAX_STORAGE: 50 * 1024 * 1024, // 50MB
  METADATA_KEY: 'globalStats'
};

// Singleton database instance
let dbInstance = null;

/**
 * Creates default metadata object
 */
const createDefaultMetadata = () => ({
  key: CONFIG.METADATA_KEY,
  totalSize: 0,
  fontCount: 0,
  lastSync: null,
  maxStorage: CONFIG.DEFAULT_MAX_STORAGE
});

/**
 * Initialize the font database with proper error handling
 */
const initDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(CONFIG.DB_NAME, CONFIG.DB_VERSION, {
      upgrade(db) {
        // Create fonts store
        if (!db.objectStoreNames.contains(CONFIG.STORES.FONTS)) {
          const fontStore = db.createObjectStore(CONFIG.STORES.FONTS, { keyPath: 'id' });
          fontStore.createIndex('byVersion', 'version');
          fontStore.createIndex('byLastUsed', 'lastUsed');
          fontStore.createIndex('byDownloadedAt', 'downloadedAt');
        }

        // Create metadata store
        if (!db.objectStoreNames.contains(CONFIG.STORES.METADATA)) {
          db.createObjectStore(CONFIG.STORES.METADATA, { keyPath: 'key' });
        }
      },
    });
    
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize font database:', error);
    throw new Error('Database initialization failed');
  }
};

/**
 * Ensures database is initialized before operations
 */
const ensureDB = async () => {
  if (!dbInstance) {
    await initDB();
  }
  return dbInstance;
};

/**
 * Generic error handler with auto-initialization
 */
const withErrorHandling = async (operation, operationName = 'Database operation') => {
  try {
    return await operation();
  } catch (error) {
    console.warn(`${operationName} failed, attempting DB initialization...`);
    await initDB();
    return await operation();
  }
};

/**
 * Get global metadata with caching
 */
const getMetadata = () => withErrorHandling(async () => {
  const db = await ensureDB();
  const metadata = await db.get(CONFIG.STORES.METADATA, CONFIG.METADATA_KEY);
  return metadata || createDefaultMetadata();
}, 'Get metadata');

/**
 * Update global metadata efficiently
 */
const updateMetadata = (updates) => withErrorHandling(async () => {
  const db = await ensureDB();
  const current = await getMetadata();
  await db.put(CONFIG.STORES.METADATA, { ...current, ...updates });
}, 'Update metadata');

/**
 * Check if font exists in cache
 */
const hasFont = (fontId) => withErrorHandling(async () => {
  const db = await ensureDB();
  const count = await db.countFromIndex(CONFIG.STORES.FONTS, 'id', fontId);
  return count > 0;
}, 'Check font existence');

/**
 * Get font from cache
 */
const getFont = (fontId) => withErrorHandling(async () => {
  const db = await ensureDB();
  return await db.get(CONFIG.STORES.FONTS, fontId);
}, 'Get font');

/**
 * Store font in cache with atomic transaction
 */
const storeFont = (fontData) => withErrorHandling(async () => {
  const db = await ensureDB();
  const tx = db.transaction([CONFIG.STORES.FONTS, CONFIG.STORES.METADATA], 'readwrite');

  try {
    // Store font
    await tx.objectStore(CONFIG.STORES.FONTS).put(fontData);

    // Update metadata
    const metadataStore = tx.objectStore(CONFIG.STORES.METADATA);
    const currentMetadata = await metadataStore.get(CONFIG.METADATA_KEY) || createDefaultMetadata();
    await metadataStore.put({
      ...currentMetadata,
      totalSize: currentMetadata.totalSize + fontData.size,
      fontCount: currentMetadata.fontCount + 1
    });

    await tx.done;
  } catch (error) {
    tx.abort();
    throw error;
  }
}, 'Store font');

/**
 * Update font's last used timestamp
 */
const updateFontLastUsed = (fontId) => withErrorHandling(async () => {
  const db = await ensureDB();
  const font = await db.get(CONFIG.STORES.FONTS, fontId);
  
  if (font) {
    font.lastUsed = Date.now();
    await db.put(CONFIG.STORES.FONTS, font);
  }
}, 'Update font timestamp');

/**
 * Delete font from cache with cleanup
 */
const deleteFont = (fontId) => withErrorHandling(async () => {
  const db = await ensureDB();
  const tx = db.transaction([CONFIG.STORES.FONTS, CONFIG.STORES.METADATA], 'readwrite');

  try {
    const fontStore = tx.objectStore(CONFIG.STORES.FONTS);
    const font = await fontStore.get(fontId);

    if (font) {
      // Cleanup blob URL
      if (font.blobUrl) {
        URL.revokeObjectURL(font.blobUrl);
      }

      // Delete font
      await fontStore.delete(fontId);

      // Update metadata
      const metadataStore = tx.objectStore(CONFIG.STORES.METADATA);
      const currentMetadata = await metadataStore.get(CONFIG.METADATA_KEY) || createDefaultMetadata();
      await metadataStore.put({
        ...currentMetadata,
        totalSize: Math.max(0, currentMetadata.totalSize - font.size),
        fontCount: Math.max(0, currentMetadata.fontCount - 1)
      });
    }

    await tx.done;
  } catch (error) {
    tx.abort();
    throw error;
  }
}, 'Delete font');

/**
 * Get all cached fonts
 */
const getAllFonts = () => withErrorHandling(async () => {
  const db = await ensureDB();
  return await db.getAll(CONFIG.STORES.FONTS);
}, 'Get all fonts');

/**
 * Get fonts by IDs with parallel fetching
 */
const getFontsByIds = (fontIds) => withErrorHandling(async () => {
  const db = await ensureDB();
  const fonts = await Promise.all(
    fontIds.map(id => db.get(CONFIG.STORES.FONTS, id))
  );
  return fonts.filter(Boolean); // Remove undefined entries
}, 'Get fonts by IDs');

/**
 * Revoke blob URLs for fonts
 */
const revokeBlobUrls = (fonts) => {
  fonts.forEach(font => {
    if (font?.blobUrl) {
      URL.revokeObjectURL(font.blobUrl);
    }
  });
};

/**
 * Clear all cached fonts
 */
const clearAllFonts = () => withErrorHandling(async () => {
  const db = await ensureDB();
  const tx = db.transaction([CONFIG.STORES.FONTS, CONFIG.STORES.METADATA], 'readwrite');
  
  try {
    // Get and cleanup fonts
    const fonts = await tx.objectStore(CONFIG.STORES.FONTS).getAll();
    revokeBlobUrls(fonts);
    
    // Clear stores
    await tx.objectStore(CONFIG.STORES.FONTS).clear();
    await tx.objectStore(CONFIG.STORES.METADATA).put(createDefaultMetadata());
    
    await tx.done;
  } catch (error) {
    tx.abort();
    throw error;
  }
}, 'Clear all fonts');

/**
 * Get storage usage statistics
 */
const getStorageStats = async () => {
  const metadata = await getMetadata();
  return {
    totalSize: metadata.totalSize,
    fontCount: metadata.fontCount,
    maxStorage: metadata.maxStorage,
    usagePercentage: (metadata.totalSize / metadata.maxStorage) * 100,
    availableSpace: metadata.maxStorage - metadata.totalSize
  };
};

/**
 * Set maximum storage limit
 */
const setMaxStorage = async (maxBytes) => {
  if (maxBytes <= 0) {
    throw new Error('Max storage must be a positive number');
  }
  await updateMetadata({ maxStorage: maxBytes });
};

/**
 * Delete database entirely with cleanup
 */
const deleteFontDB = async () => {
  try {
    const fonts = await getAllFonts();
    revokeBlobUrls(fonts);
  } catch (error) {
    console.warn('Error cleaning up during DB deletion:', error);
  }
  
  await deleteDB(CONFIG.DB_NAME);
  dbInstance = null;
};

/**
 * Get least recently used fonts for cache eviction
 */
const getLRUFonts = (limit = 10) => withErrorHandling(async () => {
  const db = await ensureDB();
  const tx = db.transaction(CONFIG.STORES.FONTS, 'readonly');
  const index = tx.objectStore(CONFIG.STORES.FONTS).index('byLastUsed');
  
  const fonts = [];
  let cursor = await index.openCursor();
  
  while (cursor && fonts.length < limit) {
    fonts.push(cursor.value);
    cursor = await cursor.continue();
  }
  
  return fonts;
}, 'Get LRU fonts');

// Export public API
export {
  initDB,
  hasFont,
  getFont,
  storeFont,
  updateFontLastUsed,
  deleteFont,
  getAllFonts,
  getFontsByIds,
  clearAllFonts,
  getStorageStats,
  setMaxStorage,
  deleteFontDB,
  getMetadata,
  updateMetadata,
  getLRUFonts
};