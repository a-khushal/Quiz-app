const express = require("express");
const router = express.Router();
const teacherLoginDB = require("../../db/teacherDB");
const studentLoginDB = require("../../db/studentDB");


router
    .route("/teacherLogin/:id/cy")
    .get(async(req,res)=>{
        try{
            const {id} = req.params;
            let subStudArr = [];
            let getTeacher = await teacherLoginDB.findById(id);
            const subject = getTeacher.subject
            subStudArr = await studentLoginDB.find({'subject.code': subject.code, 'branch': 'cy'});
            res.render("../views/branches/cy.ejs", {subStudArr})
        } catch (err) {
            console.error("Error:", err);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router;
    