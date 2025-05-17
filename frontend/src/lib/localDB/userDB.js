import { openDB, deleteDB } from "idb";

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB("userDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("user")) {
          db.createObjectStore("user", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
};

// Guardar un proyecto con imágenes
export const saveUser = async (userId) => {
  const db = await initDB();
  await db.put("user", { id: userId });
};

export const getLocalUser = async (userId) => {
  const db = await initDB();
  return await db.get("user", userId);
};

export const deleteUser = async (userId) => {
  const db = await initDB();
  await db.delete("user", userId);
};

export const clearUser = async () => {
  const db = await initDB();
  await db.clear("user");
};

export const deleteDBUser = async () => {
  await deleteDB("userDB");
};