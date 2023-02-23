import { openDB } from 'idb';

const DB_NAME = 'jate';
const DB_VERSION = 1;
const DB_STORE_NAME = 'jate';
const DB_KEY_PATH = 'id';
const DB_AUTO_INCREMENT = true;

// Initializes the IndexedDB database
const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (db.objectStoreNames.contains(DB_STORE_NAME)) {
          console.log(`${DB_STORE_NAME} database already exists`);
          return;
        }
        db.createObjectStore(DB_STORE_NAME, { keyPath: DB_KEY_PATH, autoIncrement: DB_AUTO_INCREMENT });
        console.log(`${DB_STORE_NAME} database created`);
      },
    });
    console.log(`${DB_NAME} initialized`);
    return db;
  } catch (error) {
    console.error(`Failed to initialize ${DB_NAME}: ${error}`);
    throw error;
  }
};

// Adds content to the IndexedDB database
export const putDB = async (content) => {
  console.log('PUT to the database');
  const db = await initDB();
  const tx = db.transaction(DB_STORE_NAME, 'readwrite');
  const store = tx.objectStore(DB_STORE_NAME);
  const request = store.put({ value: content });
  const result = await request;
  console.log('🚀 - data saved to the database', result.value);
};

// Gets content from the IndexedDB database
export const getDB = async () => {
  console.log('GET from the database');
  const db = await initDB();
  const tx = db.transaction(DB_STORE_NAME, 'readonly');
  const store = tx.objectStore(DB_STORE_NAME);
  const request = store.get(1);
  const result = await request;
  if (result) {
    console.log('🚀 - data retrieved from the database', result.value);
    return result.value;
  }
  console.log('🚀 - data not found in the database');
  return null;
};
