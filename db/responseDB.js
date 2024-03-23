const mongoose = require("mongoose");

const responsesSchema = mongoose.Schema({
    studentId: String,
    quizId: String,
    teacherId: String,
    response: [{
        type: Object,
    }]
});

const responseDB = mongoose.model("responseDB", responsesSchema);
module.exports = responseDB;