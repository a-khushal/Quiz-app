const mongoose = require("mongoose");
const studentLoginDB = require("./studentDB")

const teacherSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: {
        type: Object,
    },
    studentsId: [String]
});
const teacherLoginDB = mongoose.model("teacherLoginDB", teacherSchema);
module.exports = teacherLoginDB;