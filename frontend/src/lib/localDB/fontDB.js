import { openDB, deleteDB } from 'idb';

/**
 * Font Database Manager for IndexedDB-based font caching
 * Handles font storage, retrieval, and cache management
 */

// Singleton database promise
let dbPromise = null;

// Database configuration
const DB_NAME = 'fontDB';
const DB_VERSION = 1;
const FONT_STORE = 'fonts';
const METADATA_STORE = 'metadata';

// Font record structure:
// {
//   id: 'FNT001',           // Font ID (primary key)
//   name: 'Milky Week',     // Display name
//   version: '1.0.0',       // Version from backend
//   hash: 'sha256...',     // Integrity hash
//   blob: Blob,            // Font file as blob
//   blobUrl: string,       // Blob URL (recreated on demand)
//   lastUsed: timestamp,   // For LRU eviction
//   downloadedAt: timestamp, // For cache management
//   size: number           // File size in bytes
// }

// Metadata record structure:
// {
//   key: 'globalStats',
//   totalSize: number,      // Total size of all cached fonts
//   fontCount: number,      // Number of cached fonts
//   lastSync: timestamp,    // Last sync with backend
//   maxStorage: number      // Maximum allowed storage (bytes)
// }

/**
 * Initialize the font database
 */
const initDB = async () => {
  if (!dbPromise) {
    try {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Fonts store
          if (!db.objectStoreNames.contains(FONT_STORE)) {
            const fontStore = db.createObjectStore(FONT_STORE, { keyPath: 'id' });
            fontStore.createIndex('byVersion', 'version');
            fontStore.createIndex('byLastUsed', 'lastUsed');
            fontStore.createIndex('byDownloadedAt', 'downloadedAt');
          }

          // Metadata store
          if (!db.objectStoreNames.contains(METADATA_STORE)) {
            db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
          }
        },
      });
    } catch (error) {
      console.error('Error initializing font database:', error);
      throw new Error('Failed to initialize font database');
    }
  }
  return dbPromise;
};

/**
 * Get database instance
 */
const getDB = async () => {
  return await initDB();
};

/**
 * Get global metadata
 */
const getMetadata = async () => {
  const db = await getDB();
  const tx = db.transaction(METADATA_STORE, 'readonly');
  const store = tx.objectStore(METADATA_STORE);
  return await store.get('globalStats') || {
    key: 'globalStats',
    totalSize: 0,
    fontCount: 0,
    lastSync: null,
    maxStorage: 50 * 1024 * 1024 // 50MB default
  };
};

/**
 * Update global metadata
 */
const updateMetadata = async (updates) => {
  const db = await getDB();
  const current = await getMetadata();
  const updated = { ...current, ...updates };

  const tx = db.transaction(METADATA_STORE, 'readwrite');
  const store = tx.objectStore(METADATA_STORE);
  await store.put(updated);
  await tx.done;
};

/**
 * Check if font exists in cache
 */
const hasFont = async (fontId) => {
  const db = await getDB();
  const tx = db.transaction(FONT_STORE, 'readonly');
  const store = tx.objectStore(FONT_STORE);
  const font = await store.get(fontId);
  return !!font;
};

/**
 * Get font from cache
 */
const getFont = async (fontId) => {
  const db = await getDB();
  const tx = db.transaction(FONT_STORE, 'readonly');
  const store = tx.objectStore(FONT_STORE);
  return await store.get(fontId);
};

/**
 * Store font in cache
 */
const storeFont = async (fontData) => {
  const db = await getDB();
  const tx = db.transaction([FONT_STORE, METADATA_STORE], 'readwrite');

  // Store font
  const fontStore = tx.objectStore(FONT_STORE);
  await fontStore.put(fontData);

  // Update metadata
  const metadata = await getMetadata();
  const updatedMetadata = {
    ...metadata,
    totalSize: metadata.totalSize + fontData.size,
    fontCount: metadata.fontCount + 1
  };

  const metadataStore = tx.objectStore(METADATA_STORE);
  await metadataStore.put(updatedMetadata);

  await tx.done;
};

/**
 * Update font's last used timestamp
 */
const updateFontLastUsed = async (fontId) => {
  const db = await getDB();
  const tx = db.transaction(FONT_STORE, 'readwrite');
  const store = tx.objectStore(FONT_STORE);

  const font = await store.get(fontId);
  if (font) {
    font.lastUsed = Date.now();
    await store.put(font);
  }

  await tx.done;
};

/**
 * Delete font from cache
 */
const deleteFont = async (fontId) => {
  const db = await getDB();
  const tx = db.transaction([FONT_STORE, METADATA_STORE], 'readwrite');

  // Get font size before deletion
  const fontStore = tx.objectStore(FONT_STORE);
  const font = await fontStore.get(fontId);

  if (font) {
    // Revoke blob URL if exists
    if (font.blobUrl) {
      URL.revokeObjectURL(font.blobUrl);
    }

    // Delete font
    await fontStore.delete(fontId);

    // Update metadata
    const metadata = await getMetadata();
    const updatedMetadata = {
      ...metadata,
      totalSize: Math.max(0, metadata.totalSize - font.size),
      fontCount: Math.max(0, metadata.fontCount - 1)
    };

    const metadataStore = tx.objectStore(METADATA_STORE);
    await metadataStore.put(updatedMetadata);
  }

  await tx.done;
};

/**
 * Delete fonts database entirely
 */

/**
 * Get all cached fonts
 */
const getAllFonts = async () => {
  const db = await getDB();
  const tx = db.transaction(FONT_STORE, 'readonly');
  const store = tx.objectStore(FONT_STORE);
  return await store.getAll();
};

/**
 * Get fonts by IDs
 */
const getFontsByIds = async (fontIds) => {
  const db = await getDB();
  const tx = db.transaction(FONT_STORE, 'readonly');
  const store = tx.objectStore(FONT_STORE);

  const fonts = [];
  for (const fontId of fontIds) {
    const font = await store.get(fontId);
    if (font) {
      fonts.push(font);
    }
  }

  return fonts;
};

/**
 * Clear all cached fonts
 */
const clearAllFonts = async () => {
  const db = await getDB();
  const tx = db.transaction([FONT_STORE, METADATA_STORE], 'readwrite');

  // Get all fonts to revoke blob URLs
  const fontStore = tx.objectStore(FONT_STORE);
  const fonts = await fontStore.getAll();

  // Revoke all blob URLs
  fonts.forEach(font => {
    if (font.blobUrl) {
      URL.revokeObjectURL(font.blobUrl);
    }
  });

  // Clear stores
  await fontStore.clear();

  // Reset metadata
  const metadataStore = tx.objectStore(METADATA_STORE);
  await metadataStore.put({
    key: 'globalStats',
    totalSize: 0,
    fontCount: 0,
    lastSync: null,
    maxStorage: 50 * 1024 * 1024
  });

  await tx.done;
};

/**
 * Get storage usage statistics
 */
const getStorageStats = async () => {
  const metadata = await getMetadata();
  return {
    totalSize: metadata.totalSize,
    fontCount: metadata.fontCount,
    maxStorage: metadata.maxStorage,
    usagePercentage: (metadata.totalSize / metadata.maxStorage) * 100
  };
};

/**
 * Set maximum storage limit
 */
const setMaxStorage = async (maxBytes) => {
  const metadata = await getMetadata();
  await updateMetadata({
    ...metadata,
    maxStorage: maxBytes
  });
};

/**
 * Delete database entirely
 */
const deleteFontDB = async () => {
  // Get all fonts to revoke blob URLs before deletion
  try {
    const fonts = await getAllFonts();
    fonts.forEach(font => {
      if (font.blobUrl) {
        URL.revokeObjectURL(font.blobUrl);
      }
    });
  } catch (error) {
    console.warn('Error cleaning up blob URLs during DB deletion:', error);
  }

  await deleteDB(DB_NAME);
  dbPromise = null;
};

export {
  initDB,
  hasFont,
  getFont,
  storeFont,
  updateFontLastUsed,
  deleteFont,
  deleteAllFonts,
  getAllFonts,
  getFontsByIds,
  clearAllFonts,
  getStorageStats,
  setMaxStorage,
  deleteFontDB,
  getMetadata,
  updateMetadata
};