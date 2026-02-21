import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  generateCalendar,
  getCalendar,
  toggleCalendarHoliday,
} from "../controllers/calendarDate.controller.js";

const router = Router();

router
  .route("/api/v1/generate-calendar")
  .post(verifyJwt, authorize("ADMIN"), generateCalendar);
router.route("/api/v1/calendar").get(verifyJwt, getCalendar);
router
  .route("/api/v1/calendar/:id")
  .patch(verifyJwt, authorize("ADMIN"), toggleCalendarHoliday);

export default router;
