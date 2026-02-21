import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./lib/db.js";
import { createAdmin } from "./lib/createAdmin.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json()); //to parse the req.body which is in json
app.use(express.urlencoded({ extended: true })); // to parse form data coming from frontend in post request
app.use(cookieParser()); // to parse the cookies

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
import enrollmentRouter from "./routes/enrollment.route.js";

app.use(userRouter);
app.use(branchRouter);
app.use(subjectRouter);
app.use(classSessionRouter);
app.use(attendanceRouter);
app.use(calendarRouter);
app.use(enrollmentRouter);
