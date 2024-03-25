const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const zod = require("zod");
const jwt = require('jsonwebtoken');
const exp = require("constants");
const bodyParser =  require('body-parser')
const uploadFile = require('./cloud_bucket/index');
const uploadDB = require("./db/uploadDB");
const teacherLoginDB = require("./db/teacherDB");
const studentLoginDB = require("./db/studentDB");
const liveDB = require("./db/liveDB");
const responseDB = require("./db/responseDB");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, "/views")));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));
 
main()
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

const btnStatusSchema = mongoose.Schema({
    state: Boolean,
})

const timeSchema = mongoose.Schema({
    teacherID: String,
    timeInMins: Number,
    subjCode: String,
})

const quizNameSchema = mongoose.Schema({
    teacherID: String,
    quizName: String,
})

const btnStatusDB = mongoose.model('btnStatusDB', btnStatusSchema);
const timeIntervalDB = mongoose.model("timeIntervalDB", timeSchema);
const quizNameDB = mongoose.model("quizNameDB", quizNameSchema);
module.exports = {btnStatusDB, timeIntervalDB, quizNameDB};

const rootRouter = require("./routes/index");
app.use(rootRouter)


app.get("/management", async(req, res)=>{
    let students = await studentLoginDB.find();
    let teachers = await teacherLoginDB.find();
    res.render("admin/management.ejs",{teachers, students});
})

app.get("/management/new", (req, res)=>{
    res.render("admin/addNew.ejs");
});

app.post("/management/new/teacher", async(req, res)=>{
    try{
        let {username, email, subjName, subjCode} =  req.body;
        if(username && email && subjName && subjCode){
            let password = 'welcome@123';
            await teacherLoginDB.insertMany({
                username: username, 
                email: email, 
                password: password, 
                subject:{
                    name: subjName, 
                    code: subjCode,
                }
            });
        res.send("new teacher added");
        return;
        }
        res.send("all fields are mandatory!");
        return;
    }
    catch(err){
        console.log(err);
        res.send("some error occured");
    }
});

app.post("/management/new/student", async(req, res)=>{
    try{
        let requestBody = [
            {
                name: req.body.subjName1, 
                code: req.body.subjCode1,
            },
            {
                name: req.body.subjName2, 
                code: req.body.subjCode2,
            },
            {
                name: req.body.subjName3, 
                code: req.body.subjCode3,
            },
            {
                name: req.body.subjName4, 
                code: req.body.subjCode4,
            },
            {
                name: req.body.subjName5, 
                code: req.body.subjCode5,
            },
            {
                name: req.body.subjName6, 
                code: req.body.subjCode6,
            },
            {
                name: req.body.subjName7, 
                code: req.body.subjCode7,
            },
            {
                name: req.body.subjName8, 
                code: req.body.subjCode8,
            },
            {
                name: req.body.subjName9, 
                code: req.body.subjCode9,
            },
            {
                name: req.body.subjName10, 
                code: req.body.subjCode10,
            },
        ];
        const subject = requestBody.filter((subj) => subj.name != '' && subj.code!='');
        let password = 'welcome@123';
        await studentLoginDB.insertMany({
            username: req.body.username, 
            email: req.body.email, 
            password: password, 
            subject: subject,
            branch: req.body.branch
        });
        res.send("new student added");
        return;
    } catch(err){
        console.log(err);
        res.send('some error');
    }
})


app.get("/studentLogin/:id/MAT231CT", async (req, res) => {
    const id = req.params.id;
    const student = await studentLoginDB.findById(id)
    const studentBranch = student.branch;
    const code = 'MAT231CT'
    const teacher = await teacherLoginDB.findOne(
        {"subject.code": code, studentsId: {$in: [id]}},
    );
    const teacherId = teacher._id.toString();
    const liveQuiz = await liveDB.findOne({teacherId});
    if(!liveQuiz){
        res.render("subjects_views/MAT231CT.ejs", {id})
        return;
    } 
    else if(!(liveQuiz.whom.includes(studentBranch))){
        res.render("subjects_views/MAT231CT.ejs", {id})
        return;
    }
    const hasAttempted = await responseDB.findOne({quizId: liveQuiz.quizId, studentId: id});
    if(hasAttempted){
        res.render("subjects_views/MAT231CT.ejs", {id})
        return;
    }
    const quizId = liveQuiz.quizId;
    const quiz = await uploadDB.findOne({_id: quizId});
    if(!quiz){
        res.render("subjects_views/MAT231CT.ejs", {id})
        return;
    }
    const quizName = quiz.quizArray[0];
    const quizNameId = quizName + ' (' + quizId + ')';
    res.render("subjects_views/MAT231CTQuizPage.ejs", {id, quizName, quizId}); 
    
});

app.post("/studentLogin/:id/MAT231CT/attemptQuiz", async(req, res)=>{
    const id = req.params.id;
    const quizId = req.body.attemptBtn;
    const quiz = await uploadDB.findOne({_id: quizId});
    const quizName = quiz.quizArray[0];
    const duration = quiz.quizArray[2];
    const totalmarks = quiz.quizArray[1];
    const quizArray = quiz.quizArray;
    const ques1 = quizArray[3].question;
    // console.log(quizArray);
    res.render("subjects_views/MAT231CTAttemptPage.ejs", {quizId, id, quizName, duration, totalmarks, quizArray, ques1});
})

function isMultiCorrect(object){
    let multi = [];
    for (const key in object) {
        const objValue = object[key];
        if(objValue == '001'){
            multi.push(true);
        }
    }
    if(multi.length > 1)
        return 1;
    multi = [];
    return 0;
}

app.post("/studentLogin/:id/MAT231CT/response/:quizId", async(req, res)=>{
    const quizId = req.params.quizId;
    // console.log(quizId);
    const quiz = await uploadDB.findOne({_id: quizId});
    // console.log(quiz.teacherID);
    // console.log(quiz)
    // console.log(teacherId)
    // console.log(quiz[0].quizArray);
    const quizArray = quiz.quizArray;
    // console.log(Object.keys(req.body));
    for(let i=3; i<quizArray.length; i++){
        // if((quizArray.question).toString() === )
        if(Object.keys(req.body).includes((quizArray[i].question).toString())){
            // console.log(quizArray[i])
            const multipleCorrect = isMultiCorrect(quizArray[i].correctOrWrong);
            // console.log(multipleCorrect)
            const ques = quizArray[i].question.toString();
            // console.log(ques)
            let val = req.body[ques];
            // console.log(val);
            // console.log(Array.isArray(val))
            if(!(Array.isArray(val)) && multipleCorrect == 0){
                val = val.toString();
                if(quizArray[i].correctOrWrong[val] === '001'){
                    // console.log(true);
                    await responseDB.create({
                        studentId: req.params.id,
                        quizId: quizId,
                        teacherId: quiz.teacherID,
                        response: [{
                            whichQuestion: quizArray[i],
                            marksObtained: quizArray[i].marks.toString(),
                            markedOptions: val,
                        }]
                    })
                    // console.log(resp)
                } else {
                    // console.log(false);
                    await responseDB.create({
                        studentId: req.params.id,
                        quizId: quizId,
                        teacherId: quiz.teacherID,
                        response: [{
                            whichQuestion: quizArray[i],
                            marksObtained: '0',
                            markedOptions: val,
                        }]
                    })
                    // console.log(resp);
                }
            } else if(Array.isArray(val) && multipleCorrect == 1) {
                let flag = [];
                val = val.map(element => String(element));
                for(let j=0; j<val.length; j++){
                    // console.log(val[j])
                    if(quizArray[i].correctOrWrong[val[j]] === '001'){
                        flag.push(true);
                    }
                } 
                if(flag.length == val.length){
                    await responseDB.create({
                        studentId: req.params.id,
                        quizId: quizId,
                        teacherId: quiz.teacherID,
                        response: [{
                            whichQuestion: quizArray[i],
                            marksObtained: quizArray[i].marks.toString(),
                            markedOptions: val,
                        }]
                    })
                } else {
                    await responseDB.create({
                        studentId: req.params.id,
                        quizId: quizId,
                        teacherId: quiz.teacherID,
                        response: [{
                            whichQuestion: quizArray[i],
                            marksObtained: '0',
                            markedOptions: val,
                        }]
                    })
                    // console.log(resp);
                }
            } else {
                await responseDB.create({
                    studentId: req.params.id,
                    quizId: quizId,
                    teacherId: quiz.teacherID,
                    response: [{
                        whichQuestion: quizArray[i],
                        marksObtained: '0',
                        markedOptions: val,
                    }]
                })
            }
        } else {
            await responseDB.create({
                studentId: req.params.id,
                quizId: quizId,
                teacherId: quiz.teacherID,
                response: [{
                    whichQuestion: quizArray[i],
                    marksObtained: '0',
                    markedOptions: '',
                }]
            })
        }
    }
    const id = req.params.id
    res.redirect(`/studentLogin/${id}/`);
})

app.get("/studentLogin/:id/MAT231CT/viewAllAttempts", async(req, res)=>{
    const id = req.params.id;
    const hasAttempted = await responseDB.find({studentId: id});
    if(!hasAttempted){
        res.send("no previous attempts");
        return;
    }
    const teacher = await teacherLoginDB.find({"subject.code": 'MAT231CT'})
    const teacherId = teacher[0]._id.toString();
    const val = await responseDB.aggregate([
        {
            $match: {
                studentId: id,
                teacherId: teacherId,
            },
        },
        {
            $group: {
                _id: '$quizId',
                responses: {$push: '$$ROOT'}
            }
        },
    ])
    if(val){
        for(let i=0; i<val.length; i++){
            const quiz = await uploadDB.findOne({_id: val[i]._id});
            if(quiz){
                val[i].uploads = quiz.quizArray;
            }
        }
    }
    if(val.length){
        res.render("allAttempts.ejs", {val, id});
        return;
    }
    res.render("noPrevAttempts.ejs");
})

app.post("/studentLogin/:id/MAT231CT/viewParticular", async(req, res)=>{
    const id = req.params.id;
    const teacher = await teacherLoginDB.find({"subject.code": 'MAT231CT'})
    const teacherId = teacher[0]._id.toString();
    const val = await responseDB.aggregate([
        {
            $match: {
                studentId: id,
                teacherId: teacherId,
            },
        },
        {
            $group: {
                _id: '$quizId',
                responses: {$push: '$$ROOT'}
            }
        },
    ])
    let response = [];
    if(val){
        for(let i=0; i<val.length; i++){
            const quiz = await uploadDB.findOne({_id: val[i]._id});
            if(quiz){
                val[i].uploads = quiz.quizArray;
            }
        }
        for(let i=0; i<val.length; i++){
            if(val[i]._id == req.body.clickedBtn){
                response.push(val[i]);
            }
        }
    }
    // console.log(response);
    let result = response[0];
    // console.log(result);
    const quizName = result.uploads[0];
    const totalMarks = result.uploads[1];
    const duration = result.uploads[2];
    result = result.responses;
    // console.log(result)
    res.render("viewParticularAttempt.ejs", {result, id, quizName, totalMarks, duration});
})

app.get("/studentLogin/:id/MAT231CT/quiz", async(req, res)=>{
    const id = req.params.id;
    let quizQues = await uploadDB.find({ subjCode: 'MAT231CT' });
    let timeCollection = await timeIntervalDB.find({ subjCode: 'MAT231CT' });
    const timeID = timeCollection[0]._id;
    let timeInterval = 0;
    if (timeCollection.length == 0) {
      timeInterval = 0;
    } else {
      timeInterval = timeCollection[0].timeInMins;
    }
    res.render("quiz/MAT_quiz.ejs", { quizQues, timeInterval, id});
    function delay(ms){
        setTimeout(async () => {
            const ans = await timeIntervalDB.updateOne(
                { subjCode: 'MAT231CT' },
                { timeInMins: 0 }
            ); 
            // console.log(ans);
        }, ms);
    }
    delay(timeInterval*60000); 
})

app.post("/studentLogin/:id/MAT231CT/quiz/submitted", async(req, res)=>{

    const quizName = await uploadDB.find({subjCode: 'MAT231CT'});

    // const val = await responseDB.find({studentId: req.params.id, subjCode:'MAT231CT'});
    // if(val.length){
    //     await responseDB.deleteMany({studentId: req.params.id, subjCode:'MAT231CT'})
    // }

    await timeIntervalDB.updateOne(
        { subjCode: 'MAT231CT' },
        { timeInMins: 0 }
    )

    const formattedData = {};
    for(const key in req.body){
        if(key.startsWith('option')){
            id = key.split(' ')[1];
            formattedData[id] = (req.body)[key];
        }
    }

    // console.log(formattedData)
    for(const key in formattedData){
        formattedData[key] = Array.isArray(formattedData[key]) ? formattedData[key] : [formattedData[key]];    
        const markedOptions = formattedData[key];
        const correctAns = (await uploadDB.findById(key)).correctAns;
        const marksOfEachQues = (await uploadDB.findById(key)).marksOfEachQues;
        let marksEarned = 0;
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                return false;
                }
            }
            return true;
        }
        console.log(correctAns, markedOptions)
        const ans = arraysEqual(correctAns, markedOptions);
        if(ans === true){
            marksEarned = marksOfEachQues;
        }
        else{
            marksEarned = 0;
        }
        // console.log(marksEarned)
        await responseDB.create({
            questionId: key,
            studentId: req.params.id,
            subjCode: 'MAT231CT',
            markedOptions: formattedData[key],
            marksOfCorrect: marksEarned,
        })
    }
    res.redirect(`/studentLogin/${req.params.id}/MAT231CT`)
})

app.get("/studentLogin/:id/BT232AT", async(req, res)=>{
    let sub = "maths";
    res.render("subjects_views/BT232AT.ejs");
});

app.get("/studentLogin/:id/IS233AI", async(req, res)=>{
    let sub = "DSA";
    res.render("subjects_views/IS233AI.ejs");
});

app.get("/studentLogin/:id/CS234AI", async(req, res)=>{
    let sub = "OS";
    res.render("subjects_views/CS234AI.ejs");
});

app.get("/studentLogin/:id/CV232AT", async(req, res)=>{
    let sub = "Environment & Sustainability";
    res.render("subjects_views/CV232AT.ejs");
});

app.get("/studentLogin/:id/ME232AT", async(req, res)=>{
    let sub = "Material Science for Engineers";
    res.render("subjects_views/ME232AT.ejs");
});

app.listen(8080, () => {
    console.log("listening to port 8080");
});
