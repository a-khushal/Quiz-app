const express = require("express");
const router = express.Router();

router
    .route("/teacherLogin/:id/makeLive")
    .post(async(req, res)=>{
        try{
            let clickedBtnVal = req.body.clickedButton;
            const quizTomakeLive = (clickedBtnVal.split('(')[1]).split(')')[0];
            const {id} = req.params;
            res.render("makeLive.ejs", {id, quizTomakeLive});
        } catch(err){
            res.send("some error");
            console.log(err);
        }

    })

module.exports = router