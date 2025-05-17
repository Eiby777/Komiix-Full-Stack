import { openDB, deleteDB } from 'idb';

// Variable para almacenar la promesa de la base de datos como singleton
let dbPromise = null;

// Función para inicializar la base de datos (se ejecuta solo una vez)
const initDB = async () => {
  if (!dbPromise) {
    try {
      dbPromise = openDB('projectDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('projects')) {
            const store = db.createObjectStore('projects', { keyPath: 'id' });
            store.createIndex('byUser', 'user'); // Índice opcional para optimizar
          }
        },
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }
  return dbPromise;
};

// Guardar un proyecto con imágenes
export const saveProject = async (project) => {
  if (!project.id || !project.user) {
    throw new Error('projectId and userId are required');
  }
  const db = await initDB();
  await db.put('projects', project);
};

// Obtener todos los proyectos
export const getProjects = async (userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  const db = await initDB();
  const store = db.transaction(['projects']).objectStore('projects');
  const index = store.index('byUser');
  return await index.getAll(userId);
};

export const getAllProjects = async () => {
  const db = await initDB();
  const store = db.transaction(['projects']).objectStore('projects');
  return await store.getAll();
};

// Obtener un proyecto por ID
export const getProjectById = async (projectId, userId) => {
  const db = await initDB();
  const project = await db.get('projects', projectId);
  if (!project || project.user !== userId) {
    return null; // O lanza un error si prefieres: throw new Error('Project not found or access denied');
  }
  return project;
};

// Obtener todas las imágenes de un proyecto
export const getProjectImages = async (projectId, userId) => {
  const db = await initDB();
  const project = await db.get('projects', projectId);
  if (!project || project.user !== userId) {
    return [];
  }
  return project && Array.isArray(project.images) ? project.images : [];
};

// Eliminar un proyecto
export const deleteLocalProject = async (projectId, userId) => {
  const db = await initDB();
  const project = await db.get('projects', projectId);
  if (!project || project.user !== userId) {
    throw new Error('Project not found or access denied');
  }
  await db.delete('projects', projectId);
};


export const deleteAllProjects = async (userId) => {
  const db = await initDB();
  const transaction = db.transaction(['projects'], 'readwrite');
  const store = transaction.objectStore('projects');
  
  // Obtener todos los proyectos
  const allProjects = await store.getAll();
  
  // Filtrar proyectos por userId y eliminarlos
  const deletePromises = allProjects
    .filter(project => project.user === userId)
    .map(project => store.delete(project.id));
  
  // Ejecutar todas las eliminaciones
  await Promise.all(deletePromises);
};

export const deleteDBProjects = async () => {
  await deleteDB('projectDB');
  dbPromise = null; // Restablecer para permitir una nueva inicialización
};

export const clearProjects = async () => {
  const db = await initDB();
  await db.clear("projects");
};

export const updateProject = async (projectId, userId, updatedData) => {
  const db = await initDB();
  const existingProject = await db.get('projects', projectId);
  if (!existingProject || existingProject.user !== userId) {
    throw new Error('Project not found or access denied');
  }
  
  const { id, user, ...safeData } = updatedData;
  const updatedProject = { ...existingProject, ...safeData };
  await db.put('projects', updatedProject);
};
