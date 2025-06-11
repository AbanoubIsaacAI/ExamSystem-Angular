const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  passingScore: { type: Number, required: true },  
  duration: { type: Number, required: true },
});

module.exports = mongoose.model("Exam", examSchema);
