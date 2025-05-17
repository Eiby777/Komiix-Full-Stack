import { openDB } from 'idb';

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB('fontDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('fonts')) {
          db.createObjectStore('fonts', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
};

// Save font list with a timestamp
export const saveFonts = async (fontList) => {
  try {
    const db = await initDB();
    const tx = db.transaction('fonts', 'readwrite');
    const store = tx.objectStore('fonts');
    const timestamp = Date.now();
    await store.put({ key: 'fontList', data: fontList, timestamp });
    await tx.done;
  } catch (error) {
    console.error('Failed to save font list:', error.message);
    throw error;
  }
};

// Get font list and check if token is still valid (24 hours)
export const getFontList = async () => {
  try {
    const db = await initDB();
    const fontData = await db.get('fonts', 'fontList');
    if (!fontData) return null;

    const { data, timestamp } = fontData;
    const currentTime = Date.now();
    const tokenDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if token has expired
    if (currentTime - timestamp > tokenDuration) {
      return null; // Token expired
    }

    return data;
  } catch (error) {
    console.error('Failed to get font list:', error.message);
    return null;
  }
};