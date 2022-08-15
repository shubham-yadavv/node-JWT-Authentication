const express = require("express");
const router = express.Router();

const { registerUser, loginUser, changePassword } = require("../controllers/user.controller");

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.post("/api/change-password", changePassword);

module.exports = router;