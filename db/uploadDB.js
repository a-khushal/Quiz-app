const mongoose = require("mongoose");

const uplodaSchema = mongoose.Schema({
    quizArray: {
        type: Array,
    },
    teacherID: String,
});

const uploadDB = mongoose.model("uploadDB", uplodaSchema);
module.exports = uploadDB;
