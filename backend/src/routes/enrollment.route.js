import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  deleteEnrollment,
  enrollStudent,
  getAllStudentsInClass,
  getEnrollments,
  getMyEnrollments,
} from "../controllers/enrollment.controller.js";

const router = Router();

router
  .route("/api/v1/enrollment")
  .post(verifyJwt, authorize("ADMIN"), enrollStudent);
router
  .route("/api/v1/enrollments")
  .get(verifyJwt, authorize("ADMIN"), getEnrollments);
router
  .route("/api/v1/enrollment/me")
  .get(verifyJwt, authorize("STUDENT"), getMyEnrollments); //all classes in which the logged in student is enrolled
router
  .route("/api/v1/enrollment/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteEnrollment);
router
  .route("/api/v1/enrollment/:classId")
  .get(verifyJwt, authorize("TEACHER"), getAllStudentsInClass); //get all students enrolled in a specific class

export default router;
