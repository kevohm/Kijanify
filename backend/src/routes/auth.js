const express = require("express");
const { signup, login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/passportAuth");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", authenticate("local"), login);
router.get("/me", authenticate("jwt"), me);

module.exports = router;
