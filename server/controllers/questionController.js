const Question = require("../models/Question");
const Exam = require("../models/Exam");

exports.addQuestion = async (req, res) => {
  try {
    const { examId, questionText, options, correctAnswerIndex, points } = req.body;
    const question = await Question.create({ examId, questionText, options, correctAnswerIndex, points });

    await Exam.findByIdAndUpdate(examId, { $push: { questions: question._id } });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Error adding question", error: err.message });
  }
};
exports.deleteQuestion = async (req, res) => {
    try {
      const { id } = req.params;
  
      const question = await Question.findByIdAndDelete(id);
  
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      await Exam.findByIdAndUpdate(question.examId, { $pull: { questions: id } });
  
      res.json({ message: "Question deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting question", error: err.message });
    }
};
  
exports.updateQuestion = async (req, res) => {
    try {
      const { id } = req.params;
      const { questionText, options, correctAnswerIndex, points } = req.body;
  
      const updated = await Question.findByIdAndUpdate(
        id,
        { questionText, options, correctAnswerIndex, points },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating question", error: err.message });
    }
};
exports.getQuestionsByExam = async (req, res) => {
    try {
      const { examId } = req.query;
  
      if (!examId) {
        return res.status(400).json({ message: "examId is required in query" });
      }
  
      const questions = await Question.find({ examId });
  
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: "Error fetching questions", error: err.message });
    }
};