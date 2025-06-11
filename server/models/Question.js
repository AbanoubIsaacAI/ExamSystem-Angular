const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  questionText: String,
  options: [String],
  correctAnswerIndex: Number,
  points: {
    type: Number,
    default: 1, 
    min: 0
  }
});

module.exports = mongoose.model("Question", questionSchema);
