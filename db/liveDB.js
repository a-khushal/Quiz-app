const mongoose = require("mongoose");

const liveSchema = mongoose.Schema({
    teacherId: String,
    quizId: String,
    whom: [String],
})

const liveDB = mongoose.model("liveDB", liveSchema);
module.exports = liveDB;