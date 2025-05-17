import { openDB, deleteDB } from "idb";

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB("profileDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile", { keyPath: "user" });
        }
      },
    });
  }
  return dbPromise;
};

// Guardar perfil con user
export const saveLocalProfile = async (userId, userName, profilePicture) => {
  const db = await initDB();
  const profileData = { 
    user: userId,
    userName 
  };
  if (profilePicture !== undefined) {
    profileData.profilePicture = profilePicture;
  }

  await db.put("profile", profileData);
};

// Actualizar el perfil existente
export const updateLocalProfile = async (userId, updatedData) => {
  const db = await initDB();
  const existingProfile = await db.get("profile", userId);
  
  const updatedProfile = { 
    user: userId,
    ...existingProfile, 
    ...updatedData 
  };
  await db.put("profile", updatedProfile);
};

// Obtener el perfil por user
export const getLocalProfile = async (userId) => {
  const db = await initDB();
  const profile = await db.get("profile", userId);
  return profile ? profile : null;
};

// Obtener todos los perfiles (para depuración)
export const getAllProfiles = async () => {
  const db = await initDB();
  const profiles = await db.getAll("profile");
  return profiles;
};

// Eliminar perfil por user
export const deleteProfile = async (userId) => {
  const db = await initDB();
  await db.delete("profile", userId);
};

// Eliminar toda la base de datos
export const deleteAllProfiles = async () => {
  await deleteDB("profileDB");
};