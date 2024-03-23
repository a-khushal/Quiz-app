const express = require("express");
const router = express.Router();
const liveDB = require("../../db/liveDB");
const uploadDB = require("../../db/uploadDB")

router
    .route("/teacherLogin/:id/madeLive")
    .post(async(req, res)=>{
        try{
            let quizId = req.body.clickedButton;
            const id = req.params.id;
            const {cy, cs, cd} = req.body;
            let checkedBoxes = [];
            if(cy=='on')
                checkedBoxes.push("cy");
            if(cs=='on')
                checkedBoxes.push("cs");
            if(cd=='on')
                checkedBoxes.push("cd");
            await liveDB.deleteOne({quizId: quizId})
            await liveDB.create({
                teacherId: id,
                quizId: quizId,
                whom: checkedBoxes,
            })
            const quiz = await uploadDB.findOne({_id: quizId});
            const duration = parseInt(quiz.quizArray[2]);
            const durationInSec = duration * 60;
            const dateTime = new Date();
            const currTime = Math.floor(dateTime.getTime()/1000);
            const finalTime = currTime + durationInSec + 30 * 60;
            const interval = finalTime - currTime;
            setTimeout(async() => {
                await liveDB.deleteOne({quizId: quizId});
            }, interval * 1000);
            res.send(`quiz will be availabe for ${duration + 30} minutes for ${checkedBoxes}`)
        } catch(err){
            res.send("some error");
            console.log(err);
        }
    })

module.exports = router;