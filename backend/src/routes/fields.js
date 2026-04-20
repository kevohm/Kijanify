const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  listFields,
  getField,
  createField,
  patchField,
  assignAgent,
  updateStatus,
} = require("../controllers/fieldController");
const { user_role } = require("@prisma/client");

const router = express.Router();

router.use(authenticate);
router.get("/", listFields);
router.get("/:id", getField);
router.post("/", authorize(user_role.ADMIN), createField);
router.patch("/:id", authorize(user_role.ADMIN, user_role.AGENT), patchField);
router.post("/:id/assign", authorize(user_role.ADMIN), assignAgent);
router.post("/:id/status", authorize(user_role.ADMIN), updateStatus);

module.exports = router;
