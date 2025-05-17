import { openDB, deleteDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB('modelDB', 6, {
      upgrade(db) {
        if (db.objectStoreNames.contains('models')) {
          db.deleteObjectStore('models');
        }
        db.createObjectStore('models', { keyPath: 'name' });
        if (db.objectStoreNames.contains('modelVersions')) {
          db.deleteObjectStore('modelVersions');
        }
        db.createObjectStore('modelVersions', { keyPath: 'name' });
      },
    });
  }
  return dbPromise;
};

// Validate model data
const validateModelData = (name, modelData, version, token) => {
  if (typeof name !== 'string' || !name) {
    throw new Error('Model name must be a non-empty string');
  }
  if (!modelData || typeof modelData !== 'object' || typeof modelData.isFragmented !== 'boolean') {
    throw new Error('Model data must be an object with isFragmented boolean');
  }
  if (modelData.isFragmented) {
    if (
      !Array.isArray(modelData.fragments) ||
      !Array.isArray(modelData.fragment_names) ||
      typeof modelData.encrypted_fragment_index !== 'number' ||
      !(modelData.encryption_key instanceof ArrayBuffer)
    ) {
      throw new Error('Fragmented model data must contain fragments (array), fragment_names (array), encrypted_fragment_index (number), and encryption_key (ArrayBuffer)');
    }
    modelData.fragments.forEach((f, i) => {
      if (!(f instanceof ArrayBuffer) || f.byteLength === 0) {
        throw new Error(`Fragment ${i} is not a valid ArrayBuffer or has zero length`);
      }
    });
  } else {
    if (!(modelData.data instanceof ArrayBuffer)) {
      throw new Error('Non-fragmented model data must contain data (ArrayBuffer)');
    }
  }
  if (typeof version !== 'string' || !version) {
    throw new Error('Version must be a non-empty string');
  }
  if (typeof token !== 'string' || !token) {
    throw new Error('Token must be a non-empty string');
  }
};

// Save a model
export const saveModel = async (name, modelData, version, token = uuidv4()) => {
  try {
    validateModelData(name, modelData, version, token);
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const db = await initDB();
    const tx = db.transaction(['models', 'modelVersions'], 'readwrite');
    await Promise.all([
      tx.objectStore('models').put({ name, modelData, version }),
      tx.objectStore('modelVersions').put({ name, version, token, tokenExpiration }),
    ]);
    await tx.done;
    console.log(`Model ${name} saved with token: ${token}`);
  } catch (error) {
    console.error(`Failed to save model ${name}:`, error.message);
    throw error;
  }
};

// Update an existing model
export const updateModel = async (name, updatedData) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['models', 'modelVersions'], 'readwrite');
    const modelsStore = tx.objectStore('models');
    const versionsStore = tx.objectStore('modelVersions');

    const existingModel = await modelsStore.get(name);
    const existingVersion = await versionsStore.get(name);
    if (!existingModel || !existingVersion) {
      throw new Error(`Model ${name} not found`);
    }

    const updatedModel = {
      name,
      modelData: existingModel.modelData,
      version: existingModel.version,
      ...updatedData,
    };

    const updatedVersion = {
      name,
      version: existingVersion.version,
      token: existingVersion.token || uuidv4(),
      tokenExpiration: existingVersion.tokenExpiration,
      ...updatedData,
    };

    if (updatedData.modelData) {
      validateModelData(name, updatedData.modelData, updatedModel.version, updatedVersion.token);
      updatedModel.modelData = updatedData.modelData;
    }
    if (updatedData.token) {
      updatedVersion.tokenExpiration = Date.now() + 24 * 60 * 60 * 1000;
    }

    await Promise.all([
      modelsStore.put(updatedModel),
      versionsStore.put(updatedVersion),
    ]);
    await tx.done;
    console.log(`Model ${name} updated with token: ${updatedVersion.token}`);
  } catch (error) {
    console.error(`Failed to update model ${name}:`, error.message);
    throw error;
  }
};

// Get a specific model by name
export const getModel = async (name) => {
  try {
    if (typeof name !== 'string' || !name) {
      throw new Error('Model name must be a non-empty string');
    }
    const db = await initDB();
    const model = await db.get('models', name);
    return model || null;
  } catch (error) {
    console.error(`Failed to get model ${name}:`, error.message);
    return null;
  }
};

// Check model metadata (version, token, tokenExpiration)
export const checkModel = async (name) => {
  try {
    if (typeof name !== 'string' || !name) {
      throw new Error('Model name must be a non-empty string');
    }
    const db = await initDB();
    const versionData = await db.get('modelVersions', name);
    return versionData ? {
      version: versionData.version,
      token: versionData.token,
      tokenExpiration: versionData.tokenExpiration
    } : null;
  } catch (error) {
    console.error(`Failed to check model ${name}:`, error.message);
    return null;
  }
};

// Get all models
export const getAllModels = async () => {
  try {
    const db = await initDB();
    const models = await db.getAll('models');
    return models.map((model) => ({
      ...model,
      modelData: model.modelData ? model.modelData : null,
    }));
  } catch (error) {
    console.error('Failed to get all models:', error.message);
    return [];
  }
};

// Delete a specific model
export const deleteModel = async (name) => {
  try {
    if (typeof name !== 'string' || !name) {
      throw new Error('Model name must be a non-empty string');
    }
    const db = await initDB();
    const tx = db.transaction(['models', 'modelVersions'], 'readwrite');
    await Promise.all([
      tx.objectStore('models').delete(name),
      tx.objectStore('modelVersions').delete(name),
    ]);
    await tx.done;
  } catch (error) {
    console.error(`Failed to delete model ${name}:`, error.message);
    throw error;
  }
};

// Delete the entire database
export const deleteAllModels = async () => {
  try {
    await deleteDB('modelDB');
    dbPromise = null;
    console.log("Model database deleted.");
  } catch (error) {
    console.error('Failed to delete model database:', error.message);
    throw error;
  }
};