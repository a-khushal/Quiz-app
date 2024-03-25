const express = require("express")
const router = express.Router();
const liveDB = require("../../db/liveDB");

router
    .route("/teacherLogin/:id/makeOffline")
    .post(async(req, res)=>{
        try{
            const id = req.params.id;
            const quizNamesId = req.body.makeOfflineBtn;
            const quizId = (quizNamesId.split("("))[1].split(")")[0];
            await liveDB.deleteMany({quizId});
            res.redirect(`/teacherLogin/${id}/viewAllQuizzes`);
        } catch(e) {
            res.send("some error");
            console.log(e);
        }
    })
    

module.exports = router;
