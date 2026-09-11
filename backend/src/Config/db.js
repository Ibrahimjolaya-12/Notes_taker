import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. Check karo ke connection exist karta hai AUR socket active (connected) hai
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is missing!");
  }
  console.log("Mongodb connected")
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Serverless mein queries ko freeze karne ke bajaye fauran fail-fast karo
      maxPoolSize: 10,       // Atlas connection limits ko exhaust hone se bachata hai
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;