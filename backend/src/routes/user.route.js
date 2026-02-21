import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  addUser,
  changePassword,
  currentUser,
  deleteUserById,
  getAllStudents,
  getAllTeachers,
  getUserById,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserById,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//authenticated routes
router.route("/api/v1/logout").post(verifyJwt, logoutUser);
router.route("/api/v1/change-password").patch(verifyJwt, changePassword);
router.route("/api/v1/current-user").get(verifyJwt, currentUser);

//admin routes
router
  .route("/api/v1/students")
  .get(verifyJwt, authorize("ADMIN"), getAllStudents);
router
  .route("/api/v1/teachers")
  .get(verifyJwt, authorize("ADMIN"), getAllTeachers);
router
  .route("/api/v1/users/:id")
  .get(verifyJwt, authorize("ADMIN"), getUserById);
router
  .route("/api/v1/users/:id")
  .patch(verifyJwt, authorize("ADMIN"), updateUserById);
router
  .route("/api/v1/users/:id")
  .delete(verifyJwt, authorize("ADMIN"), deleteUserById);
router.route("/api/v1/add-user").post(verifyJwt, authorize("ADMIN"), addUser);

export default router;
