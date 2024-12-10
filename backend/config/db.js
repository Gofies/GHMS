import mongoose from "mongoose";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        const username = process.env.MONGO_USERNAME;
        const password = process.env.MONGO_PASSWORD;

        const mongoURI = 'mongodb://mongos:27020'

        mongoose.connect(mongoURI);

        console.log("Connected to the MongoDB database");
    } catch (error) {
        console.log("Error connecting to the MongoDB database: ", error.message);
    }
};

// Connect to PostgreSQL
const connectToPostgreSQL = async () => {
    try {
        const client = new Client({
            user: process.env.POSTGRES_USERNAME,
            host: "postgres",
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        });

        await client.connect();
        console.log("Connected to the PostgreSQL database");
        
    } catch (error) {
        console.log("Error connecting to the PostgreSQL database: ", error.message);
    }
};

export { connectToMongoDB, connectToPostgreSQL };