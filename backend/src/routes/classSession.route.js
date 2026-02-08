import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router
  .route("/api/v1/class-session")
  .post(verifyJwt, authorize("ADMIN"), createClassSession);
router.route("/api/v1/class-sessions").get(verifyJwt, getClassSessions);
router.route("/api/v1/class-session/:id").get(verifyJwt, getClassSessionById);
router
  .route("/api/v1/class-session/:id")
  .patch(verifyJwt, authorize("ADMIN"), updateClassSession);
router
  .route("/api/v1/class-session/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteClassSession);

export default router;
