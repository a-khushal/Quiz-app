const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const zod = require("zod");
const jwt = require('jsonwebtoken');
const exp = require("constants");


app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "/views")));
app.set('view engine', 'ejs');

main()
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

const studentSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: [{
        type: Object,
    }]
});

const teacherSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: {
        type: Object,
    }
});

const studentLoginDB = mongoose.model("studentLoginDB", studentSchema);
const teacherLoginDB = mongoose.model("teacherLoginDB", teacherSchema);
module.exports = {studentLoginDB, teacherLoginDB};


app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.get("/login", async(req, res) => {
    try{
        const allStudents = await studentLoginDB.find({});
        const allTeachers = await teacherLoginDB.find({});
        res.render("login.ejs", {allStudents, allTeachers});
    } catch(err){
        res.send('some error occured')
    }
});

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if(email==='admin@gmail.com' && password==='adminrvce'){
            res.redirect('/management');
            return;
        }
        let checkStudent = await studentLoginDB.findOne({ email, password });
        let checkTeacher = await teacherLoginDB.findOne({ email, password });
        if (checkStudent != null) {
            res.redirect(`/studentLogin/${checkStudent._id}`);
            return;
        }
        else if (checkTeacher != null) {
            res.redirect(`/teacherLogin/${checkTeacher._id}`);
            return;
        }
        res.send("Email or password is incorrect try again");
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/management", async(req, res)=>{
    let students = await studentLoginDB.find();
    let teachers = await teacherLoginDB.find();
    res.render("admin/management.ejs",{teachers, students});
})

app.get("/management/new", (req, res)=>{
    res.render("admin/addNew.ejs");
});

app.post("/management/new/teacher", async(req, res)=>{
    try{
        let {username, email, subjName, subjCode} =  req.body;
        if(username && email && subjName && subjCode){
            let password = 'welcome@123';
            await teacherLoginDB.insertMany({
                username: username, 
                email: email, 
                password: password, 
                subject:{
                    name: subjName, 
                    code: subjCode,
                }
            });
        res.send("new teacher added");
        return;
        }
        res.send("all fields are mandatory!");
        return;
    }
    catch(err){
        console.log(err);
        res.send("some error occured");
    }
});

app.post("/management/new/student", async(req, res)=>{
    try{
        let {username, email, subjName1, subjCode1, subjName2, subjCode2, subjName3, subjCode3, subjName4, subjCode4, subjName5, subjCode5, subjName6, subjCode6, subjName7, subjCode7, subjName8, subjCode8, subjName9, subjCode9, subjName10, subjCode10} = req.body;
        let password = 'welcome@123';
        await studentLoginDB.insertMany({
            username: username, 
            email: email, 
            password: password, 
            subject:[
                {
                    name: subjName1, 
                    code: subjCode1,
                },
                {
                    name: subjName2, 
                    code: subjCode2,
                },
                {
                    name: subjName3, 
                    code: subjCode3,
                },
                {
                    name: subjName4, 
                    code: subjCode4,
                },
                {
                    name: subjName5, 
                    code: subjCode5,
                },
                {
                    name: subjName6, 
                    code: subjCode6,
                },
                {
                    name: subjName7, 
                    code: subjCode7,
                },
                {
                    name: subjName8, 
                    code: subjCode8,
                },
                {
                    name: subjName9, 
                    code: subjCode9,
                },
                {
                    name: subjName10, 
                    code: subjCode10,
                },
            ]
        });
        res.send("new student added");
        return;
    } catch(err){
        console.log(err);
        res.send('some error');
    }
})

app.get("/studentLogin/:id", async(req, res)=>{
    const {id} = req.params;
    let getStudent = await studentLoginDB.findById(id);
    let subjectArr = [];
    subjectArr = getStudent.subject;
    let username = getStudent.username;
    res.render("showStudent.ejs", {username, subjectArr, id})
});

app.get("/teacherLogin/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        let subStudArr = [];
        let getTeacher = await teacherLoginDB.findById(id);
        const subject = getTeacher.subject;
        const username = getTeacher.username;
        subStudArr = await studentLoginDB.find({'subject.code': subject.code});
        res.render("showTeacher.ejs", {username, subject, id, subStudArr})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/studentLogin/:id/MAT231CT", async(req, res)=>{
    let sub = "Maths";
    res.render("subjects_views/MAT231CT.ejs");
});

app.get("/studentLogin/:id/BT232AT", async(req, res)=>{
    let sub = "maths";
    res.render("subjects_views/MAT231CT.ejs");
});

app.get("/studentLogin/:id/IS233AI", async(req, res)=>{
    let sub = "DSA";
    res.render("subjects_views/IS233AI.ejs");
});

app.get("/studentLogin/:id/CS234AI", async(req, res)=>{
    let sub = "OS";
    res.render("subjects_views/CS234AI.ejs");
});

app.get("/studentLogin/:id/CV232AT", async(req, res)=>{
    let sub = "Environment & Sustainability";
    res.render("subjects_views/CV232AT.ejs");
});

app.get("/studentLogin/:id/ME232AT", async(req, res)=>{
    let sub = "Material Science for Engineers";
    res.render("subjects_views/ME232AT.ejs");
});



app.listen(8080, () => {
    console.log("listening to port 8080");
});
