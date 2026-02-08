import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router
  .route("/api/v1/attendance/:classSessionId")
  .get(verifyJwt, authorize("ADMIN", "TEACHER"), getAllStudentsAtendance);
router
  .route("/api/v1/attendance/me")
  .get(verifyJwt, authorize("STUDENT"), getMyAttendance);
router
  .route("/api/v1/attendance/mark")
  .post(verifyJwt, authorize("TEACHER"), markAttendance);
router
  .route("/api/v1/attendance/:id")
  .patch(verifyJwt, authorize("TEACHER"), updateAttendance);

export default router;
