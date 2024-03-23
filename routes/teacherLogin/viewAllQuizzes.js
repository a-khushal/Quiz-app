const express = require("express")
const router = express.Router();
const uploadDB = require("../../db/uploadDB")

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
            let quizNamesId = []
            for(let i=0; i<allquizzes.length; i++)
                quizNamesId.push(allquizzes[i].quizArray[0] + " (" + allquizzes[i]._id + ")");
            res.render("../views/allQuizzes.ejs", {quizNamesId, id});
        } catch(err){
            res.send("some error")
            console.log(err);
        }
    })

module.exports = router;