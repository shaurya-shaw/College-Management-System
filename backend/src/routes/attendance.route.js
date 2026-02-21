import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  attendanceSummary,
  getStudentsAtendanceSheet,
  markAttendance,
  myAttendance,
} from "../controllers/attendance.controller.js";

const router = Router();

router
  .route("/api/v1/attendance/:classSessionId")
  .get(verifyJwt, authorize("ADMIN", "TEACHER"), getStudentsAtendanceSheet);
router
  .route("/api/v1/attendance/me")
  .get(verifyJwt, authorize("STUDENT"), myAttendance);
router
  .route("/api/v1/attendance/mark")
  .post(verifyJwt, authorize("TEACHER"), markAttendance);

router
  .route("/api/v1/attendance/summary/:studentId")
  .get(verifyJwt, authorize("ADMIN", "TEACHER", "STUDENT"), attendanceSummary);

export default router;
