const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  getAdminDashboard,
  getAgentDashboard,
} = require("../controllers/dashboardController");
const { user_role } = require("@prisma/client");

const router = express.Router();

router.use(authenticate);

router.get("/admin", authorize(user_role.ADMIN), getAdminDashboard);
router.get("/agent", authorize(user_role.AGENT), getAgentDashboard);

module.exports = router;

