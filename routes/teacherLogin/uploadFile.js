const express = require("express")
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');
const mammoth = require('mammoth');
const uploadDB = require("../../db/uploadDB")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileSize = parseInt(req.headers["content-length"]);
        if (fileSize > 500000) {
            return cb(new Error("File size exceeds limit"));
        }
        const directory = __dirname + '/uploads/' + req.params.id + '/';
        fs.access(directory, fs.constants.F_OK, (err) => {
            if (err) {
                fs.mkdir(directory, { recursive: true }, (err) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, directory);
                });
            } else {
                cb(null, directory);
            }
        });
    },
    filename: function (req, file, cb) {
        const fileSize = parseInt(req.headers["content-length"])  
        if(fileSize>500000)
            return;  
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const currFileName = req.params.id+'_'+uniqueSuffix+'.docx'
        cb(null, currFileName);
        req.currFileName = currFileName;
        const bucketFilePath = req.params.id+"/"+req.params.id+'_'+uniqueSuffix+'.docx';
        const localFilePath = __dirname+'/uploads'+"/"+req.params.id+'/'+req.params.id+'_'+uniqueSuffix+'.docx';
    }
})
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500000 }
})


router
    .route("/teacherLogin/:id/uploadFile")
    .post(upload.single('edittedFile'), async(req, res) => {
        try{
            const filename = req.currFileName;
            const id = req.params.id;
            let finalobj = {}
            let finalarr = [];
            try{
                mammoth.extractRawText({path: __dirname + `/uploads/${id}/${filename}`})
                    .then(async function(result){
                        let text = result.value; 
                        const arr = text.split('\n');
                        let filteredArr = arr.filter(line=> line.trim() !== '')
                        const quizName = filteredArr[0].split(":")[1];
                        const totalmarks = filteredArr[1].split(":")[1];
                        const duration = filteredArr[2].split(":")[1];
                        function splitQuestions(data) {
                            const questionArrays = [];
                            let currentIndex = 0;
                            while (currentIndex < data.length) {
                            const startIndex = data.findIndex((item, index) => index >= currentIndex && item.match(/^Question \d+ \(MC\)$/));
                            if (startIndex === -1) break;
                        
                            const endIndex = data.findIndex((item, index) => index > startIndex && item.match(/^Question \d+ \(MC\)$/));
                        
                            const questionArray = data.slice(startIndex, endIndex === -1 ? data.length : endIndex);
                            questionArrays.push(questionArray);
                            currentIndex = endIndex === -1 ? data.length : endIndex;
                            }
                        
                            return questionArrays;
                        }
                        let questions = splitQuestions(filteredArr);
                        finalarr.push(quizName.trim())
                        finalarr.push(totalmarks.trim())
                        finalarr.push(duration.trim());
                        for(let i=0; i<questions.length; i++){
                            filteredArr = questions[i];
                            let ques = '';
                            let indexOfMC;
                            for(let i=0; i<filteredArr.length; i++){
                                if(filteredArr[i]=='MC')
                                    indexOfMC = i
                            }
                            if(indexOfMC===2)
                                ques = filteredArr[1]
                            else {
                                for(let i=1; i<indexOfMC; i++){
                                    if(i!=indexOfMC-1)
                                        ques += filteredArr[i]+`                    `;
                                    else 
                                        ques += filteredArr[i];
                                }
                            } 
        
                            let optarr = [];
                            const marks = parseInt(filteredArr[indexOfMC+2]);
                            let marksarr = [];
                            let noofooptions = 0;
                            for (let i = 0; i < filteredArr.length; i++) {
                                if (filteredArr[i] === 'Number of options?')
                                noofooptions = parseInt(filteredArr[i + 1]);
                                if (filteredArr[i] === 'A' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i+1]!='B')){
                                    if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                                        optarr.push(filteredArr[i + 1]);
                                        marksarr.push(filteredArr[i+2]);
                                    }
                                    else {
                                        let st=''; let j=0;
                                        for(let k=i+1; filteredArr[k]!='B'; k++){
                                            if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                                                st+=filteredArr[k]+'                    ';
                                                j=k;
                                            }
                                        }
                                        optarr.push(st); 
                                        st='';
                                        marksarr.push(filteredArr[j+1]);
                                    }
                                }
                                else if (filteredArr[i] === 'B' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i + 1] !== 'C')){
                                    if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                                        optarr.push(filteredArr[i + 1]);
                                        marksarr.push(filteredArr[i+2]);
                                    }
                                    else {
                                        let st=''; let j=0;
                                        for(let k=i+1; filteredArr[k]!='C'; k++){
                                            if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                                                st+=filteredArr[k]+'                    ';
                                                j=k;
                                            }
                                        }
                                        optarr.push(st); 
                                        st='';
                                        marksarr.push(filteredArr[j+1]);
                                    }
                                }
                                else if (filteredArr[i] === 'C' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001'&& filteredArr[i + 1] !== 'D')){
                                    if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                                        optarr.push(filteredArr[i + 1]);
                                        marksarr.push(filteredArr[i+2]);
                                    }
                                    else {
                                        let st=''; let j=0;
                                        for(let k=i+1; filteredArr[k]!='D'; k++){
                                            if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                                                st+=filteredArr[k]+'                    ';
                                                j=k;
                                            }
                                        }
                                        optarr.push(st); 
                                        st='';
                                        marksarr.push(filteredArr[j+1]);
                                    }
                                }
                                else if (filteredArr[i] === 'D' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i + 1] !== 'E')){
                                    if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                                        optarr.push(filteredArr[i + 1]);
                                        marksarr.push(filteredArr[i+2]);
                                    }
                                    else {
                                        let st=''; let j=0;
                                        for(let k=i+1; filteredArr[k]!='E'; k++){
                                            if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                                                st+=filteredArr[k]+'                    ';
                                                j=k;
                                            }
                                        }
                                        optarr.push(st);
                                        st='';
                                        marksarr.push(filteredArr[j+1]);
                                    }
                                }
                                else if (filteredArr[i] === 'E' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001') && i !== (filteredArr.length - 1)){
                                    if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                                        optarr.push(filteredArr[i + 1]);
                                        marksarr.push(filteredArr[i+2]);
                                    }
                                    else {
                                        let st=''; let j=0;
                                        for(let k=i+1; k<filteredArr.length; k++){
                                            if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                                                st+=filteredArr[k]+'                    ';
                                                j=k;
                                            }
                                        }
                                        optarr.push(st);
                                        st='';
                                        marksarr.push(filteredArr[filteredArr.length-1]);
                                    }
                                }
                            }
                            const optionsObj = {}; const marksObj = {}
                            const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
                            // for (let i = 0; i < optarr.length; i++) {
                            //     optionsObj[alphabet[i]] = optarr[i];
                            // }
                            // console.log(optarr);
                            for(let i=0; i<marksarr.length; i++){
                                marksObj[optarr[i].toString()] = marksarr[i];
                            }
                            finalobj = {question: ques, marks: marks, enteredOptions: optarr, noofooptions: noofooptions, correctOrWrong: marksObj};
                            finalarr.push(finalobj)
                        }
                        await uploadDB.create({quizArray: finalarr, teacherID: req.params.id});
                    })
                } catch(err){
                    res.send(err);
                    console.log(err);
                    return;
                }
            res.redirect(`/teacherLogin/${req.params.id}/quizTemplate`);
        } catch(err){
            res.send("some error");
            console.log(err);
        }
    })

router
    .route("/teacherLogin/:id/uploadFile/back")
    .get((req, res)=>{
        res.redirect(`/teacherLogin/${req.params.id}`)
    })
module.exports = router;