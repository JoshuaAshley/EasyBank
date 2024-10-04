// conn.mjs
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid'; // Import UUID generation

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

export const findUserByAccountNumber = async (accountNumber) => {
  try {
    const user = await db.collection("users").findOne({ accountNumber });
    return user;
  } catch (err) {
    console.error("Error finding user: ", err);
    throw err;
  }
};

export const findUserByIdentificationNumber = async (identificationNumber) => {
  try {
    const user = await db.collection("users").findOne({ identificationNumber });
    return user;
  } catch (err) {
    console.error("Error finding user: ", err);
    throw err;
  }
};

// Function to add a payment to the payments collection
export const addPayment = async (username, paymentRecord) => {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  // Generate a UUID for the payment
  const paymentId = uuidv4();

  // Prepare the payment record
  const paymentData = {
    ...paymentRecord,
    paymentId,
  };

  // Insert the payment record into a specific collection for the user
  const paymentsCollection = db.collection(`payments_${user.username}`); // Collection named after user ID
  const result = await paymentsCollection.insertOne(paymentData);
  return result;
};

// Export the connection and database
export { db, conn };