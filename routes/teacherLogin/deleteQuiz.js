const express = require("express");
const router = express.Router();
const uploadDB = require("../../db/uploadDB");
const liveDB = require("../../db/liveDB");

router 
    .route("/teacherLogin/:id/deleteQuiz")
    .post(async(req, res)=>{
        try{
            const id = req.params.id;
            const delBtnVal = req.body.deleteButton;
            const quizToDelete = (delBtnVal.split('(')[1].split(')'))[0];
            await uploadDB.deleteOne({_id: quizToDelete});
            await liveDB.deleteOne({quizId: quizToDelete});
            res.redirect(`/teacherLogin/${id}/viewAllQuizzes`);
        } catch(err){
            res.send("some error");
            console.log(err);
        }
    })

module.exports = router;