const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: {
        type: Object,
    }
});
const teacherLoginDB = mongoose.model("teacherLoginDB", teacherSchema);
module.exports = teacherLoginDB;