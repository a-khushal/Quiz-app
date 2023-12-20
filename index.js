const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const {studentLoginDB, teacherLoginDB} = require("./init/loginIndex");


app.use(express.urlencoded({extended: true}));
app.set(express.static(path.join(__dirname, "/views")));
app.set('view engine', 'ejs');

main()
    .then(()=>console.log("connected"))
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}


app.get("/", (req, res)=>{
    res.render("index.ejs");
});

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.post("/", async(req, res)=>{
    try{
        let {email, password} = req.body;
        let checkStudent = await studentLoginDB.findOne({email, password});
        let checkTeacher = await teacherLoginDB.findOne({email, password});
        // let username = await studentLoginDB.findOne({email}).username;
        if(checkStudent!=null){
            let username = checkStudent.username;
            // console.log(username);
            res.render("showStudent.ejs", {username});
            return;
        }
        else if(checkTeacher!=null){
            let username = checkTeacher.username;
            // console.log(username);
            res.render("showTeacher.ejs", {username});
            return;
        }
        res.send("Email or password is incorrect try again");
        // res.send(checkTeacher);
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(8080, ()=>{
    console.log("listening to port 8080");
});