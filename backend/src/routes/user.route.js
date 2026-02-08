import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.route("/api/v1/login").post(loginUser);
router.route("/api/v1/refresh-token").get(refreshToken);

//authenticated routes
router.route("/api/v1/logout").post(verifyJwt, logoutUser);
router.route("/api/v1/change-password").patch(verifyJwt, changePassword);
router.route("/api/v1/update-profile").patch(verifyJwt, updateProfile);
router.route("/api/v1/current-user").get(verifyJwt, currentUser);

//admin routes
router.route("/api/v1/users").get(verifyJwt, authorize("ADMIN"), getAllUsers);
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
