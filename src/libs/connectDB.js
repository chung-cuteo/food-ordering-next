import mongoose from "mongoose";

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URL;
  if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.log("Failure:Unconnected to MongoDB");
    throw new Error();
  }
};

export default connectDB;
