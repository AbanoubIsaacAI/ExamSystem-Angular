const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getMyResults, getAllResults } = require("../controllers/resultController");

router.get("/my", auth, role("student"), getMyResults);
router.get("/all", auth, role("admin"), getAllResults);

module.exports = router;
