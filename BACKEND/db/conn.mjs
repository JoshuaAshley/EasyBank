import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB");
} catch (err) {
  console.log(err);
}

let db = client.db("easy-bank");

export default conn;