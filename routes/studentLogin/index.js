const express = require("express");
const router = express.Router();
const studentLoginDB = require("../../db/studentDB");

router
    .route("/studentLogin/:id")
    .get(async(req, res)=>{
        try{
            const {id} = req.params;
            let getStudent = await studentLoginDB.findById(id);
            let subjectArr = [];
            subjectArr = getStudent.subject;
            let username = getStudent.username;
            res.render("../views/showStudent.ejs", {username, subjectArr, id})
        } catch(e){
            res.send("Some error occured");
            console.log(e);
        }

    });

module.exports = router;