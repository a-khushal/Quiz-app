const express = require("express")
const router = express.Router();
const uploadDB = require("../../db/uploadDB")
const liveDB = require("../../db/liveDB");

router
    .route("/teacherLogin/:id/viewAllQuizzes")
    .get(async(req, res)=>{
        try{
            const id = req.params.id
            const allquizzes = await uploadDB.find({teacherID: id});
            if(allquizzes.length==0){
                res.send("no quizzes! consider creating")
                return;
            }
            let quizNamesId = [];
            let quizId;
            let allLiveQuizzes;
            for(let i=0; i<allquizzes.length; i++){
                quizId = allquizzes[i]._id;
                allLiveQuizzes = await liveDB.find({quizId: quizId});
                if(allLiveQuizzes.length > 0){
                    quizNamesId.push({"dispName": allquizzes[i].quizArray[0] + " (" + allquizzes[i]._id + ")", "isMadeLive": true})
                } else {
                    quizNamesId.push({"dispName": allquizzes[i].quizArray[0] + " (" + allquizzes[i]._id + ")", "isMadeLive": false})
                }
            }
            res.render("../views/allQuizzes.ejs", {quizNamesId, id});
        } catch(err){
            res.send("some error")
            console.log(err);
        }
    })


module.exports = router;