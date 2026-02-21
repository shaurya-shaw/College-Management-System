import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  getBranchById,
} from "../controllers/branch.controller.js";

const router = Router();

router
  .route("/api/v1/branch")
  .post(verifyJwt, authorize("ADMIN"), createBranch);
router
  .route("/api/v1/branches")
  .get(verifyJwt, authorize("ADMIN"), getAllBranches);
router
  .route("/api/v1/branch/:id")
  .get(verifyJwt, authorize("ADMIN"), getBranchById);
router
  .route("/api/v1/branch/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteBranch);

export default router;
