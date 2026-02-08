import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router
  .route("/api/v1/branch")
  .post(verifyJwt, authorize("ADMIN"), createBranch);
router
  .route("/api/v1/branches")
  .get(verifyJwt, authorize("ADMIN", "TEACHER"), getBranches);
router.route("/api/v1/branch/:id").get(verifyJwt, getBranchById);
router
  .route("/api/v1/branch/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteBranch);

export default router;
