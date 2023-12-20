const mongoose = require("mongoose");
const data = require("./loginData");

const studentSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const teacherSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

main()
    .then(()=>console.log("connected"))
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

const studentLoginDB = mongoose.model("studentLoginDB", studentSchema);
const teacherLoginDB = mongoose.model("teacherLoginDB", teacherSchema);
module.exports = {studentLoginDB, teacherLoginDB};

async function initDB(){
    await studentLoginDB.deleteMany({});
    await teacherLoginDB.deleteMany({});

    await studentLoginDB.insertMany(data.studentData);
    await teacherLoginDB.insertMany(data.teacherData);

}

initDB();




