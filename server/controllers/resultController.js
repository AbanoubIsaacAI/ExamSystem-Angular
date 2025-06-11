const Result = require("../models/Result");

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id }).populate("exam");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching results", error: err.message });
  }
};
exports.getAllResults = async (req, res) => {
    try {
      const results = await Result.find()
        .populate("student", "username email")
        .populate("exam", "title");
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: "Error fetching all results", error: err.message });
    }
  };
  