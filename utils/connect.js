import { MongoClient } from "mongodb";

let uri =
  "mongodb+srv://mrhealthnc:Ragul125@cluster0.tempw8m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside /config/dev.js",
  );
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Connects to the MongoDB database and returns an object with the client and a `getDB` function.
 * The `getDB` function can be used to get a specific database or the cached database.
 * @returns {Promise<{client: MongoClient, getDB: (name?: string) => Db | null}>}
 */
const connectDB = async () => {
  const getDB = (name) => {
    let db = null;
    if (name) {
      db = client.db(name);
      cachedDb = db;
      cachedClient = client;
      return db;
    }
    if (cachedDb) {
      return cachedDb;
    }
    return db;
  };

  cachedClient = client;
  return { client, getDB };
};

/**
 * Terminates the connection to the MongoDB database.
 * @returns {Promise<boolean>} Returns `true` if the termination was successful and `false` if there was an error.
 */
const terminateDB = async () => {
  try {
    await client.close();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * Gets a collection from a specific database.
 * @param {string} dbName - The name of the database.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<Collection | undefined>} The collection from the database.
 */
const getCollection = async (dbName, collectionName) => {
  const { getDB } = await connectDB();
  const db = getDB(dbName);
  const collection = db?.collection(collectionName);
  return collection;
};

/**
 * Creates a collection in a specific database.
 * @param {string} dbName - The name of the database.
 * @param {string} collectionName - The name of the collection.
 * @param {CreateCollectionOptions} [options] - Optional settings for creating the collection.
 * @returns {Promise<Collection | null>} The created collection, or `null` if the collection already exists.
 */
const createCollection = async (dbName, collectionName, options) => {
  const { getDB } = await connectDB();
  const db = getDB(dbName);
  const collection = db?.collection(collectionName);
  if (!collection) return db?.createCollection(collectionName, options);
  return null;
};

module.exports = { connectDB, terminateDB, getCollection, createCollection };
