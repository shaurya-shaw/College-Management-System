import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createClassSession,
  deleteClassSession,
  getAllClassSession,
  getClassSessionById,
  getMyClassSessions,
  getTeacherDashboard,
  studentClassSession,
  updateClassSession,
} from "../controllers/classSession.controller.js";

const router = Router();

router
  .route("/api/v1/class-session")
  .post(verifyJwt, authorize("ADMIN"), createClassSession);
router
  .route("/api/v1/class-sessions")
  .get(verifyJwt, authorize("TEACHER"), getMyClassSessions); //get all class sessions of the logged in teacher
router.route("/api/v1/class-session/:id").get(verifyJwt, getClassSessionById);
router
  .route("/api/v1/all-class-session")
  .get(verifyJwt, authorize("ADMIN"), getAllClassSession);
router
  .route("/api/v1/class-session/:id")
  .patch(verifyJwt, authorize("ADMIN"), updateClassSession);
router
  .route("/api/v1/class-session/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteClassSession);

router
  .route("/api/v1/student-class-sessions")
  .get(verifyJwt, authorize("STUDENT"), studentClassSession);

router
  .route("/api/v1/teacher-dashboard")
  .get(verifyJwt, authorize("TEACHER"), getTeacherDashboard);

export default router;
