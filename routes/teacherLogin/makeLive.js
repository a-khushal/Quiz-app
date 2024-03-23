const express = require("express");
const router = express.Router();
const uploadDB = require("../../db/uploadDB")

router
    .route("/teacherLogin/:id/makeLive")
    .post(async(req, res)=>{
        try{
            let clickedBtnVal = req.body.clickedButton;
            const quizTomakeLive = (clickedBtnVal.split('(')[1]).split(')')[0];
            const quiz = await uploadDB.find({_id: quizTomakeLive});
            const quizName = quiz[0].quizArray[0];
            const duration = quiz[0].quizArray[2];
            const {id} = req.params;
            res.render("makeLive.ejs", {id, quizId :quizTomakeLive, quizName, duration});
        } catch(err){
            res.send("some error");
            console.log(err);
        }

    })

module.exports = router