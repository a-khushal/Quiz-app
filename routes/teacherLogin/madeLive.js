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
            await liveDB.deleteOne({quizId: quizId});
            const madeLiveFunction = (async() => {
                await liveDB.create({
                    teacherId: id,
                    quizId: quizId,
                    whom: checkedBoxes,
                })
                const quiz = await uploadDB.findOne({_id: quizId});
                const duration = parseInt(quiz.quizArray[2]);
                const durationInSec = duration * 60;
                const dateTime = new Date();
                const currTimeInSec = Math.floor(dateTime.getTime()/1000);
                const finalTimeInSec = currTimeInSec + durationInSec + 30 * 60;
                const interval = finalTimeInSec - currTimeInSec;
                setTimeout(async() => {
                    await liveDB.deleteOne({quizId: quizId});
                }, interval * 1000);
                res.redirect(`/teacherLogin/${id}/viewAllQuizzes`);
            })
            const allLiveQuizzes = await liveDB.find();
            if(allLiveQuizzes.length>0){
                for(let i=0; i<allLiveQuizzes.length; i++){
                    const whom = allLiveQuizzes[i].whom;
                    for(let j=0; j<whom.length; j++){
                        if(checkedBoxes.includes(whom[j])){
                            res.send(`A quiz is already live for ${whom[j]}`);
                            return;
                        }
                    }
                    madeLiveFunction();
                }
            } else {
                madeLiveFunction();
            } 
        } catch(err){
            res.send("some error");
            console.log(err);
        }
    })

module.exports = router;