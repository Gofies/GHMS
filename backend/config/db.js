import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117,router02:27118/HospitalDatabase?authMechanism=DEFAULT&authSource=admin`;

        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Connected to the MongoDB database");
    } catch (error) {
        console.log("Error connecting to the MongoDB database: ", error.message);
    }

};

export { connectToMongoDB };