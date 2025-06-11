const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getUserResults } = require("../controllers/userController");

router.get("/results", auth, getUserResults);

module.exports = router;
