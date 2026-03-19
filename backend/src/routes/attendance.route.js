import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  attendanceSummary,
  generateAttendanceQrCode,
  getStudentsAtendanceSheet,
  markAttendance,
  myAttendance,
  scanAttendanceQrCode,
} from "../controllers/attendance.controller.js";

const router = Router();

router
  .route("/api/v1/attendance/:classSessionId")
  .get(verifyJwt, authorize("ADMIN", "TEACHER"), getStudentsAtendanceSheet);
router
  .route("/api/v1/my-attendance")
  .get(verifyJwt, authorize("STUDENT"), myAttendance);
router
  .route("/api/v1/attendance/:classSessionId")
  .post(verifyJwt, authorize("TEACHER"), markAttendance);

router
  .route("/api/v1/attendance-summary")
  .get(verifyJwt, authorize("STUDENT"), attendanceSummary);

router
  .route("/api/v1/generate-qr/:classSessionId/:date")
  .get(verifyJwt, authorize("TEACHER"), generateAttendanceQrCode);

router
  .route("/api/v1/scan-qr")
  .post(verifyJwt, authorize("STUDENT"), scanAttendanceQrCode);

export default router;
