const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");

exports.createExam = async (req, res) => {
  try {
    const { title, description, passingScore, duration } = req.body;
    const exam = await Exam.create({
      title,
      description,
      passingScore,
      duration,
      createdBy: req.user._id,
    });
    res.status(201).json(exam);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating exam", error: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions"); // ← هنا
    res.json(exams);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching exams", error: err.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");
    res.json(exam);
  } catch (err) {
    res.status(404).json({ message: "Exam not found", error: err.message });
  }
};
exports.deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;

    await Question.deleteMany({ examId });
    await Exam.findByIdAndDelete(examId);

    res.json({ message: "Exam and related questions deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting exam", error: err.message });
  }
};
exports.submitExam = async (req, res) => {
  const { examId, answers } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Optional: prevent re-submission
    const existingResult = await Result.findOne({
      student: req.user._id,
      exam: examId,
    });
    if (existingResult) {
      return res
        .status(400)
        .json({ message: "You have already submitted this exam." });
    }

    const examQuestions = await Question.find({ examId });

    let score = 0;
    let total = 0;
    const resultAnswers = [];

    for (const question of examQuestions) {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      if (!userAnswer) continue;

      const isCorrect =
        Number(userAnswer.selectedIndex) ===
        Number(question.correctAnswerIndex);

      const questionPoints = question.points || 1;
      total += questionPoints;

      if (isCorrect) score += questionPoints;

      resultAnswers.push({
        questionId: question._id,
        selectedIndex: userAnswer.selectedIndex,
        isCorrect,
      });
    }

    const percentage = (score / total) * 100;
    const passed = percentage >= exam.passingScore;

    const result = await Result.create({
      student: req.user._id,
      exam: examId,
      score,
      total,
      answers: resultAnswers,
      passed,
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      score,
      total,
      percentage: percentage.toFixed(2),
      passed,
      answers: resultAnswers,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error submitting exam",
      error: err.message,
    });
  }
};

exports.updateExamWithQuestions = async (req, res) => {
  try {
    const examId = req.params.id;
    const { title, description, passingScore, duration, questions } = req.body;

    // Update exam details
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { title, description, passingScore, duration },
      { new: true }
    );

    if (questions && Array.isArray(questions)) {
      const existingQuestionIds = updatedExam.questions.map((q) =>
        q.toString()
      );
      const newQuestionIds = [];

      for (const q of questions) {
        const {
          questionId,
          questionText,
          options,
          correctAnswerIndex,
          points,
        } = q;

        if (questionId) {
          // Update existing question
          await Question.findByIdAndUpdate(questionId, {
            questionText,
            options,
            correctAnswerIndex,
            points,
          });
          newQuestionIds.push(questionId);
        } else {
          // Create new question
          const newQuestion = await Question.create({
            questionText,
            options,
            correctAnswerIndex,
            points,
            exam: examId,
          });
          newQuestionIds.push(newQuestion._id);
        }
      }

      // Remove questions that were deleted from the frontend
      const questionsToRemove = existingQuestionIds.filter(
        (id) => !newQuestionIds.includes(id)
      );
      await Question.deleteMany({ _id: { $in: questionsToRemove } });

      // Update exam with new question references
      updatedExam.questions = newQuestionIds;
      await updatedExam.save();
    }

    const populatedExam = await Exam.findById(examId).populate("questions");
    res.json({ message: "Exam and questions updated", exam: populatedExam });
  } catch (err) {
    res.status(500).json({
      message: "Error updating exam and questions",
      error: err.message,
    });
  }
};
exports.createExamWithQuestions = async (req, res) => {
  try {
    const { title, description, passingScore, duration, questions } = req.body;

    const exam = await Exam.create({
      title,
      description,
      passingScore,
      duration,
      createdBy: req.user._id,
    });

    const questionIds = [];

    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        const { questionText, options, correctAnswerIndex, points } = q;
        const question = await Question.create({
          examId: exam._id,
          questionText,
          options,
          correctAnswerIndex,
          points,
        });
        questionIds.push(question._id);
      }

      exam.questions = questionIds;
      await exam.save();
    }

    const populatedExam = await Exam.findById(exam._id).populate("questions");

    res.status(201).json({
      message: "Exam with questions created",
      exam: populatedExam,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating exam with questions",
      error: err.message,
    });
  }
};
