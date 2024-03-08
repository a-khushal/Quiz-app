const express = require("express");
const router = express.Router();
const teacherLoginDB = require("../../db/teacherDB");

router
    .route("/teacherLogin/:id")
    .get(async(req, res)=>{
        try{
            const {id} = req.params;
            let getTeacher = await teacherLoginDB.findById(id);
            const subject = getTeacher.subject;
            const username = getTeacher.username;
            res.render("../views/showTeacher.ejs", {username, subject, id})
        } catch (err) {
            console.error("Error:", err);
            res.status(500).send("Internal Server Error");
        }
    });

module.exports = router;