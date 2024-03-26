const mongoose = require("mongoose");
const teacherLoginDB = require("./teacherDB");

const studentSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    usn: String,
    subject: [{
        type: Object,
    }],
    branch: String,
});

const studentLoginDB = mongoose.model("studentLoginDB", studentSchema);
module.exports = studentLoginDB;