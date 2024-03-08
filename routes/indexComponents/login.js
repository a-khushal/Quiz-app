const express = require("express");
const router = express.Router();
const studentLoginDB = require("../../db/studentDB");
const teacherLoginDB = require("../../db/teacherDB");

router
    .route("/login")
    .get(async(req, res) => {
        try{
            const allStudents = await studentLoginDB.find({});
            const allTeachers = await teacherLoginDB.find({});
            res.render("../views/login.ejs", {allStudents, allTeachers});
        } catch(err){
            res.send('some error occured')
        }
    })
    .post(async (req, res) => {
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

module.exports = router;