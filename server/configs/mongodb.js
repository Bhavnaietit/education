import mongoose from "mongoose";

// connect to MongoDB Database
const connectDB= async() => {
    mongoose.connection.on('connected', () => {
        console.log("Database Connected!")
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/lsm`);
}
export default connectDB;