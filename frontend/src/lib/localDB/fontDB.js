import { openDB } from 'idb';

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB('fontDB', 2, {
      upgrade(db, oldVersion) {
        // Store para la lista de fuentes disponibles
        if (!db.objectStoreNames.contains('fontList')) {
          db.createObjectStore('fontList', { keyPath: 'key' });
        }
        
        // Store para los archivos de fuentes descargados
        if (!db.objectStoreNames.contains('fontFiles')) {
          db.createObjectStore('fontFiles', { keyPath: 'name' });
        }
      },
    });
  }
  return dbPromise;
};

// ===== FUNCIONES PARA LA LISTA DE FUENTES =====

// Guardar lista de fuentes disponibles con timestamp
export const saveFontList = async (fontList) => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontList', 'readwrite');
    const store = tx.objectStore('fontList');
    const timestamp = Date.now();
    await store.put({ key: 'availableFonts', data: fontList, timestamp });
    await tx.done;
  } catch (error) {
    console.error('Failed to save font list:', error.message);
    throw error;
  }
};

// Obtener lista de fuentes disponibles (verifica expiración de 24 horas)
export const getFontList = async () => {
  try {
    const db = await initDB();
    const fontData = await db.get('fontList', 'availableFonts');
    
    if (!fontData) return null;
    
    const { data, timestamp } = fontData;
    const currentTime = Date.now();
    const tokenDuration = 24 * 60 * 60 * 1000; // 24 horas
    
    // Verificar si la lista ha expirado
    if (currentTime - timestamp > tokenDuration) {
      return null; // Lista expirada
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get font list:', error.message);
    return null;
  }
};

// Eliminar lista de fuentes
export const deleteFontList = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontList', 'readwrite');
    const store = tx.objectStore('fontList');
    await store.delete('availableFonts');
    await tx.done;
    console.log('Font list deleted');
  } catch (error) {
    console.error('Failed to delete font list:', error.message);
    throw error;
  }
};

// ===== FUNCIONES PARA ARCHIVOS DE FUENTES =====

// Guardar archivo de fuente con metadata
export const saveFontFile = async (fontName, fontBlob, version = '1.0') => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontFiles', 'readwrite');
    const store = tx.objectStore('fontFiles');
    
    const fontData = {
      name: fontName,
      blob: fontBlob,
      version: version,
      timestamp: Date.now(),
      size: fontBlob.size
    };
    
    await store.put(fontData);
    await tx.done;
    console.log(`Font saved locally: ${fontName} v${version}`);
  } catch (error) {
    console.error('Failed to save font file:', error.message);
    throw error;
  }
};

// Obtener archivo de fuente por nombre
export const getFontFile = async (fontName) => {
  try {
    const db = await initDB();
    const fontData = await db.get('fontFiles', fontName);
    return fontData || null;
  } catch (error) {
    console.error('Failed to get font file:', error.message);
    return null;
  }
};

// Actualizar archivo de fuente existente
export const updateFontFile = async (fontName, fontBlob, version = '1.0') => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontFiles', 'readwrite');
    const store = tx.objectStore('fontFiles');
    
    const existingFont = await store.get(fontName);
    
    if (existingFont) {
      const updatedFont = {
        ...existingFont,
        blob: fontBlob,
        version: version,
        timestamp: Date.now(),
        size: fontBlob.size
      };
      
      await store.put(updatedFont);
      await tx.done;
      console.log(`Font updated locally: ${fontName} v${version}`);
    } else {
      // Si no existe, crear uno nuevo
      await saveFontFile(fontName, fontBlob, version);
    }
  } catch (error) {
    console.error('Failed to update font file:', error.message);
    throw error;
  }
};

// Verificar si una fuente existe localmente y su versión
export const checkFontVersion = async (fontName, requiredVersion = '1.0') => {
  try {
    const fontData = await getFontFile(fontName);
    
    if (!fontData) {
      return { exists: false, needsUpdate: true };
    }
    
    const needsUpdate = fontData.version !== requiredVersion;
    
    return {
      exists: true,
      needsUpdate: needsUpdate,
      currentVersion: fontData.version,
      requiredVersion: requiredVersion
    };
  } catch (error) {
    console.error('Failed to check font version:', error.message);
    return { exists: false, needsUpdate: true };
  }
};

// Eliminar fuente específica
export const deleteFontFile = async (fontName) => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontFiles', 'readwrite');
    const store = tx.objectStore('fontFiles');
    await store.delete(fontName);
    await tx.done;
    console.log(`Font deleted: ${fontName}`);
  } catch (error) {
    console.error('Failed to delete font file:', error.message);
    throw error;
  }
};

// Obtener información de todas las fuentes almacenadas
export const getAllStoredFonts = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontFiles', 'readonly');
    const store = tx.objectStore('fontFiles');
    const fonts = await store.getAll();
    
    return fonts.map(font => ({
      name: font.name,
      version: font.version,
      size: font.size,
      timestamp: font.timestamp
    }));
  } catch (error) {
    console.error('Failed to get all stored fonts:', error.message);
    return [];
  }
};

// Limpiar fuentes antiguas (más de 7 días)
export const cleanupOldFonts = async (maxAge = 7 * 24 * 60 * 60 * 1000) => {
  try {
    const db = await initDB();
    const tx = db.transaction('fontFiles', 'readwrite');
    const store = tx.objectStore('fontFiles');
    const fonts = await store.getAll();
    
    const currentTime = Date.now();
    const fontsToDelete = fonts.filter(font => 
      currentTime - font.timestamp > maxAge
    );
    
    for (const font of fontsToDelete) {
      await store.delete(font.name);
      console.log(`Cleaned up old font: ${font.name}`);
    }
    
    await tx.done;
    return fontsToDelete.length;
  } catch (error) {
    console.error('Failed to cleanup old fonts:', error.message);
    return 0;
  }
};