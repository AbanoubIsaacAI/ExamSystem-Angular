const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  submitExam,
  createExam,
  getAllExams,
  getExamById,
  deleteExam,
  updateExam,
  updateExamWithQuestions,
  createExamWithQuestions,
} = require("../controllers/examController");

router.post("/submit", auth, role("student"), submitExam);
router.get("/", auth, getAllExams);
router.get("/:id", auth, getExamById);
router.post("/", auth, role("admin"), createExam);
router.put("/:id/full", auth, role("admin"), updateExamWithQuestions);
router.post("/add-exam", auth, role("admin"), createExamWithQuestions);
router.delete("/:id", auth, role("admin"), deleteExam);

module.exports = router;
