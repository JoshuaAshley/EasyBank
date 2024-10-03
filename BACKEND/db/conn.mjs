import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

// Initialize the MongoClient with the connection string
const client = new MongoClient(connectionString);

let conn;
let db;

// Try connecting to the database
try {
  conn = await client.connect();
  console.log("Connected to MongoDB");

  // Access the database
  db = client.db("easy-bank");

} catch (err) {
  console.error("MongoDB connection failed: ", err);
  process.exit(1); // Exit if connection fails
}

// Function to add a user to the users collection
export const addUser = async (user) => {
  try {
    const result = await db.collection("users").insertOne(user);
    return result;
  } catch (err) {
    console.error("Error inserting user: ", err);
    throw err;
  }
};

// Function to find a user by username
export const findUserByUsername = async (username) => {
  try {
    const user = await db.collection("users").findOne({ username });
    return user;
  } catch (err) {
    console.error("Error finding user: ", err);
    throw err;
  }
};

// Function to find a user by account number
export const findUserByAccountNumber = async (accountNumber) => {
  try {
    const user = await db.collection("users").findOne({ accountNumber });
    return user;
  } catch (err) {
    console.error("Error finding user: ", err);
    throw err;
  }
};

// Export the connection and database
export { db, conn };