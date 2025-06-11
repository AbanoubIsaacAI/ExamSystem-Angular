const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { addQuestion, deleteQuestion, updateQuestion, getQuestionsByExam } = require("../controllers/questionController");

router.post("/", auth, role("admin"), addQuestion);
router.delete("/:id", auth, role("admin"), deleteQuestion);
router.put("/:id", auth, role("admin"), updateQuestion);
router.get("/", auth, role("admin"), getQuestionsByExam);

module.exports = router;
