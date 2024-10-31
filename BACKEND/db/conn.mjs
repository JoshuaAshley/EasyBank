// conn.mjs
import { MongoClient, ObjectId  } from "mongodb";
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

  // Insert the payment record into a specific collection for the user
  const paymentsCollection = db.collection(`payments_${user.username}`); // Collection named after user ID
  const result = await paymentsCollection.insertOne(paymentRecord);
  return result;
};

// Function to get all unverified payments across all users
export const getAllPaymentsInDatabase = async () => {
  try {
    // Get all collections
    const collections = await db.collections();
    
    const allPayments = [];

    // Loop through each collection to find unverified payments
    for (const collection of collections) {
      // Check if the collection name starts with 'payments_'
      if (collection.collectionName.startsWith('payments_')) {
        try {
          const payments = await collection.find({ verified: "Pending" }).toArray(); // Only fetch unverified payments
          allPayments.push(...payments);
        } catch (err) {
          console.error(`Error fetching payments from collection ${collection.collectionName}:`, err);
        }
      }
    }

    return allPayments;
  } catch (error) {
    console.error('Error fetching all payments:', error); // Log the error
    throw new Error('Failed to fetch all payments');
  }
};

// Function to get unverified payments for a specific user by username
export const getPaymentsByUsername = async (username) => {
  try {
    // Get all collections
    const collections = await db.collections();
    
    const allPayments = [];

    // Loop through each collection to find unverified payments
    for (const collection of collections) {
      // Check if the collection name matches 'payments_<username>'
      if (collection.collectionName === 'payments_' + username) {
        try {
          const payments = await collection.find({ }).toArray(); // Only fetch unverified payments
          allPayments.push(...payments);
        } catch (err) {
          console.error(`Error fetching payments from collection ${collection.collectionName}:`, err);
        }
      }
    }

    return allPayments;
  } catch (error) {
    console.error('Error fetching user payments:', error); // Log the error
    throw new Error('Failed to fetch user payments');
  }
};

export const getPaymentById = async (username, paymentId) => {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const paymentsCollection = db.collection(`payments_${user.username}`);
  const payment = await paymentsCollection.findOne({ _id: new ObjectId(paymentId) }); // Ensure you import ObjectId
  return payment;
};

export const verifyPaymentById = async (username, paymentId) => {
  const paymentsCollection = `payments_${username}`; // Collection specific to the user
  const result = await db.collection(paymentsCollection).updateOne(
    { _id: new ObjectId(paymentId) }, // Use ObjectId to find the payment
    { $set: { verified: "Verified" } } // Set verified to true
  );
  return result;
};

export const declinePaymentById = async (username, paymentId) => {
  const paymentsCollection = `payments_${username}`; // Collection specific to the user
  const result = await db.collection(paymentsCollection).updateOne(
    { _id: new ObjectId(paymentId) }, // Use ObjectId to find the payment
    { $set: { verified: "Declined" } } // Set verified to true
  );
  return result;
};

// Export the connection and database
export { db, conn };