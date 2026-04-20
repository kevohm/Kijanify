const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { listUsers } = require("../controllers/userController");
const { user_role } = require("@prisma/client");

const router = express.Router();

router.use(authenticate, authorize(user_role.ADMIN));
router.get("/", listUsers);

module.exports = router;
