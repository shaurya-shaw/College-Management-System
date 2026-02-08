import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router
  .route("/api/v1/add-subject")
  .post(verifyJwt, authorize("ADMIN"), addSubject);
router.route("/api/v1/get-subjects").get(verifyJwt, getSubjects);
router
  .route("/api/v1/update-subject/:id")
  .patch(verifyJwt, authorize("ADMIN"), updateSubject);
router
  .route("/api/v1/delete-subject/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteSubject);

export default router;
