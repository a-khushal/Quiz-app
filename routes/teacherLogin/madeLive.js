const express = require("express");
const router = express.Router();

router
    .route("/teacherLogin/:id/madeLive")
    .post(async(req, res)=>{
        try{
            let clickedBtnVal = req.body.clickedButton;
            const id = req.params.id;
            const {cy, cs, cd} = req.body;
            let checkedBoxes = [];
            if(cy=='on')
                checkedBoxes.push("cy");
            if(cs=='on')
                checkedBoxes.push("cs");
            if(cd=='on')
                checkedBoxes.push("cd");
            console.log(checkedBoxes)
            res.send(`quiz is made live for ${checkedBoxes}`)
        } catch(err){
            res.send("some error");
            console.log(err);
        }
    })

module.exports = router;