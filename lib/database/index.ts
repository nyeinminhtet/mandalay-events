import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.connn;

  if (!MONGODB_URL) throw new Error("MONGODB URL is missing!");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "mandalyEvents",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
