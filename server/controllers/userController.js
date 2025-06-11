const Result = require("../models/Result");
const Exam = require("../models/Exam");

exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user._id; 

    const results = await Result.find({ userId }).populate("examId", "title description");

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user results", error: err.message });
  }
};
