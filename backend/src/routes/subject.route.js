import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
  getMySubjects,
  getSubjectById,
  updateSubject,
} from "../controllers/subject.controller.js";

const router = Router();

router
  .route("/api/v1/add-subject")
  .post(verifyJwt, authorize("ADMIN"), addSubject);
router
  .route("/api/v1/get-Mysubjects")
  .get(verifyJwt, authorize("STUDENT"), getMySubjects);
router
  .route("/api/v1/update-subject/:id")
  .patch(verifyJwt, authorize("ADMIN"), updateSubject);
router
  .route("/api/v1/delete-subject/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteSubject);

router
  .route("/api/v1/all-subjects")
  .get(verifyJwt, authorize("ADMIN"), getAllSubjects);
router.route("/api/v1/subject/:id").get(verifyJwt, getSubjectById);

export default router;
