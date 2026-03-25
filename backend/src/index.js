import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./lib/db.js";
import { createAdmin } from "./lib/createAdmin.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://college-management-system-gilt.vercel.app", // Your main production URL
  "https://college-management-system-git-main-shaurya-shaws-projects.vercel.app", // Your branch URL
  "http://localhost:5173", // Add your local dev server port (e.g., Vite defaults to 5173, React to 3000)
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // If the origin is in our allowed list, let it pass
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json()); //to parse the req.body which is in json
app.use(express.urlencoded({ extended: true })); // to parse form data coming from frontend in post request
app.use(cookieParser()); // to parse the cookies

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectdb();
    await createAdmin();

    app.listen(PORT, () => {
      console.log("server is running on port", PORT);
    });
  } catch (error) {
    console.error("startup failed");
    process.exit(1);
  }
};

startServer();

//routes
import userRouter from "./routes/user.route.js";
import branchRouter from "./routes/branch.route.js";
import subjectRouter from "./routes/subject.route.js";
import classSessionRouter from "./routes/classSession.route.js";
import attendanceRouter from "./routes/attendance.route.js";
import calendarRouter from "./routes/calendarDate.route.js";

app.use(userRouter);
app.use(branchRouter);
app.use(subjectRouter);
app.use(classSessionRouter);
app.use(attendanceRouter);
app.use(calendarRouter);
