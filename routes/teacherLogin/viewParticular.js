const express = require("express")
const router = express.Router();
const uploadDB = require("../../db/uploadDB")

router
    .route("/teacherLogin/:id/viewParticular")
    .post(async(req, res)=>{
        try{
            let clickedBtnVal = req.body.clickedButton;
            const quizToView = (clickedBtnVal.split('(')[1]).split(')')[0];
            const quiz = await uploadDB.findOne({_id: quizToView});
            let quizQues = [];
            const quizName = quiz.quizArray[0];
            const totalmarks = quiz.quizArray[1];
            const duration = quiz.quizArray[2];
            for(let i=3; i<(quiz.quizArray).length; i++){
                quizQues.push(quiz.quizArray[i]);
            }
            res.render("../views/viewParticular.ejs", {quizQues, quizName, totalmarks, duration});
        } catch(err){
            res.send("some error")
            console.log(err);
        }
    })

module.exports = router;

