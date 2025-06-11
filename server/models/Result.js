const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  score: Number,
  total: Number,
  passed: { type: Boolean, default: false },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedIndex: Number,
      isCorrect: Boolean,
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);

