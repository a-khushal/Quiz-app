const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: [{
        type: Object,
    }],
    branch: String,
});

const studentLoginDB = mongoose.model("studentLoginDB", studentSchema);
module.exports = studentLoginDB;