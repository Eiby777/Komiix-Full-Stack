import { openDB, deleteDB } from "idb";

let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB("darkDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("dark")) {
          const store = db.createObjectStore("dark", { keyPath: "id" });
          store.createIndex("byId", "id", { unique: true });
        }
      },
    });
  }
  return dbPromise;
};

export const saveDarkTheme = async (dark) => {
  const db = await initDB();
  await db.put("dark", { id: 1, value: dark });
};

export const getDarkTheme = async () => {
  const db = await initDB();
  const dark = await db.get("dark", 1);
  return dark ? dark.value : false;
};
