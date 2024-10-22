import mongoose from "mongoose";

export default async function connectToDb() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to ${connection.connection.host}`)
    } catch (error) {

    }
}