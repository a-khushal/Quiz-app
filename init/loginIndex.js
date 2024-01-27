const mongoose = require("mongoose");
const data = require("./loginData");
const { studentLoginDB, teacherLoginDB , uploadDB, timeIntervalDB, btnStatusDB} = require("../index.js");

main()
    .then(()=>{
        console.log("connected")
    })
    .catch((err)=>{
        console.log(err)
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

const initDb = async()=>{
    await studentLoginDB.deleteMany({});
    await teacherLoginDB.deleteMany({});
    await uploadDB.deleteMany({});
    await timeIntervalDB.deleteMany({});
    await btnStatusDB.deleteMany({});

    await studentLoginDB.insertMany(data.studentData);
    await teacherLoginDB.insertMany(data.teacherData);
}

initDb();




