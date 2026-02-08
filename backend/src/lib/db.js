import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("successfully connected to database", conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
