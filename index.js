const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const zod = require("zod");
const jwt = require('jsonwebtoken');
const exp = require("constants");
const bodyParser =  require('body-parser')
const multer  = require('multer')
const fs = require('fs');
const Grid = require('gridfs-stream')
const crypto = require('crypto')
var mammoth = require("mammoth");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "/views")));
app.set('view engine', 'ejs');


mammoth.extractRawText({path: "Document.docx"})
    .then(function(result){
        var text = result.value; // The raw text 

        //this prints all the data of docx file
        console.log(text);

        for (var i = 0; i < text.length; i++) {
            //this prints all the data char by char in separate lines
            console.log(text[i]);
        }
        var messages = result.messages;
    })
    .done();

main()
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

// const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/quizApp')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const fileSize = parseInt(req.headers["content-length"])  
      if(fileSize>500000)
        return;  
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const fileSize = parseInt(req.headers["content-length"])  
        if(fileSize>500000)
            return;  
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, req.params.id+'_'+uniqueSuffix+'.docx');
    }
})
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500000 }
})


const studentSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: [{
        type: Object,
    }],
    branch: String,
});

const teacherSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    subject: {
        type: Object,
    }
});

const uplodaSchema = mongoose.Schema({
    heading: String,
    question: String,
    options: [String],
    teacherID: String,
    subjCode: String,
    correctAns: [String],
    marksOfEachQues: Number,
    quizName: String,
});

const btnStatusSchema = mongoose.Schema({
    state: Boolean,
})

const timeSchema = mongoose.Schema({
    teacherID: String,
    timeInMins: Number,
    subjCode: String,
})

const responsesSchema = mongoose.Schema({
    questionId: String,
    subjCode: String,
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentLoginDB',
    },
    markedOptions: [String],
    marksOfCorrect: Number,
    quizName: String,
})

const quizNameSchema = mongoose.Schema({
    teacherID: String,
    quizName: String,
})

const studentLoginDB = mongoose.model("studentLoginDB", studentSchema);
const teacherLoginDB = mongoose.model("teacherLoginDB", teacherSchema);
const uploadDB = mongoose.model("uploadDB", uplodaSchema);
const btnStatusDB = mongoose.model('btnStatusDB', btnStatusSchema);
const timeIntervalDB = mongoose.model("timeIntervalDB", timeSchema);
const responseDB = mongoose.model("responseDB", responsesSchema);
const quizNameDB = mongoose.model("quizNameDB", quizNameSchema);
module.exports = {studentLoginDB, teacherLoginDB, btnStatusDB, uploadDB, timeIntervalDB, responseDB, quizNameDB};

// const storage = new GridFsStorage({
//     url: 'mongodb://127.0.0.1:27017/quizApp',
//     // options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file)=>{
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         return{
//             bucketName: 'uploadDB',
//             filename: req.params.id+'_'+uniqueSuffix+'.docx'
//         }
//     }
// })

// conn.once('open', ()=>{
//     let gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploadDB')
// })

// const storage = new GridFsStorage({
//     url: 'mongodb://127.0.0.1:27017/quizApp',
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if(err){
//                     return reject(err);
//                 }
//                 const filename = req.params.id + '_' +  buf.toString('hex') + '.docx';
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'uploadDB'
//                 } 
//                 resolve(fileInfo);
//             })
//         })
//     }
// })

// const upload = multer({
//     storage,
//     limits: {fileSize: 500000}
// });

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.use(express.static('public'));

app.use(express.static(path.join(__dirname,'public')));

let publicPath=path.join(__dirname,'public');
console.log(publicPath);


app.get('/why',(req,res)=>{
    res.render("why.ejs")
});

 app.get('/about',(req,res)=>{
     res.render("about.ejs")
 });


app.get('/contact',(req,res)=>{
     res.render("contact.ejs")
});

app.get("/login", async(req, res) => {
    try{
        const allStudents = await studentLoginDB.find({});
        const allTeachers = await teacherLoginDB.find({});
        res.render("login.ejs", {allStudents, allTeachers});
    } catch(err){
        res.send('some error occured')
    }
});

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if(email==='admin@gmail.com' && password==='adminrvce'){
            res.redirect('/management');
            return;
        }
        let checkStudent = await studentLoginDB.findOne({ email, password });
        let checkTeacher = await teacherLoginDB.findOne({ email, password });
        if (checkStudent != null) {
            res.redirect(`/studentLogin/${checkStudent._id}`);
            return;
        }
        else if (checkTeacher != null) {
            res.redirect(`/teacherLogin/${checkTeacher._id}`);
            return;
        }
        res.send("Email or password is incorrect try again");
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

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

app.get("/studentLogin/:id", async(req, res)=>{
    const {id} = req.params;
    let getStudent = await studentLoginDB.findById(id);
    let subjectArr = [];
    subjectArr = getStudent.subject;
    let username = getStudent.username;
    res.render("showStudent.ejs", {username, subjectArr, id})
});

app.get("/teacherLogin/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        let subStudArr = [];
        let getTeacher = await teacherLoginDB.findById(id);
        const subject = getTeacher.subject;
        const username = getTeacher.username;
        res.render("showTeacher.ejs", {username, subject, id})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/teacherLogin/:id/cy', async(req,res)=>{
    try{
        const {id} = req.params;
        let subStudArr = [];
        let getTeacher = await teacherLoginDB.findById(id);
        const subject = getTeacher.subject
        subStudArr = await studentLoginDB.find({'subject.code': subject.code, 'branch': 'cy'});
        res.render("branches/cy.ejs", {subStudArr})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.get('/teacherLogin/:id/cd', async(req,res)=>{
    try{
        const {id} = req.params;
        let subStudArr = [];
        let getTeacher = await teacherLoginDB.findById(id);
        const subject = getTeacher.subject
        subStudArr = await studentLoginDB.find({'subject.code': subject.code, 'branch': 'cd'});
        res.render("branches/cd.ejs", {subStudArr})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.get('/teacherLogin/:id/cs', async(req,res)=>{
    try{
        const {id} = req.params;
        let subStudArr = [];
        let getTeacher = await teacherLoginDB.findById(id);
        const subject = getTeacher.subject
        subStudArr = await studentLoginDB.find({'subject.code': subject.code, 'branch': 'cs'});
        res.render("branches/cs.ejs", {subStudArr})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/teacherLogin/:id/quizName", async(req, res)=>{
    const id = req.params.id;
    res.render("quizName.ejs", {id})
})

app.get("/teacherLogin/:id/quizTemplate", async(req, res)=>{
    const id = req.params.id;
    res.render('template.ejs', {id});
})

app.post("/teacherLogin/:id/quizTemplate", async(req, res)=>{
    const filePath = '/home/khushal/Desktop/Document.docx';
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { 
            headers: {
                'Content-Disposition': 'attachment; filename="template.docx"'
            }
        }, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('File sent successfully');
            }
        });
    } else {
        console.error('Error: File not found');
        res.status(404).send('File not found');
    }
})

app.post("/teacherLogin/:id/uploadFile", upload.single('edittedFile'), async(req, res)=>{
    res.json({file: req.file})
})

app.post("/teacherLogin/:id/quizName", async(req, res)=>{
    const id = req.params.id;
    await quizNameDB.deleteMany({teacherID: req.params.id});
    await quizNameDB.create({quizName: req.body.quizName, teacherID: req.params.id});
    // console.log(req.body.quizName)
    res.render("set.ejs", {id});
})

app.post("/teacherLogin/:id/uploads", async(req, res)=>{
    const val = await quizNameDB.find({teacherID: req.params.id})
    const quizName = val[0].quizName;
    // console.log(quizName);
    const heading = req.body.hiddenInput;
    // console.log(req.body.hiddenInput)
    const id = req.params.id;
    const subjTeacher = await teacherLoginDB.findById(id)
    const subjCode = subjTeacher.subject.code;
    const allQues = await uploadDB.find({subjCode: subjCode});
    allQuesLen = allQues.length;
    let timeInput=0;
    const detailOfTeacherInputTime = await timeIntervalDB.find({teacherID: id});
    if(detailOfTeacherInputTime.length == 0){
        timeInput=0;
        // console.log(timeInput);
    }
    else{
        timeInput = detailOfTeacherInputTime[0].timeInMins;
        // console.log(timeInput);
    }
    res.render("uploads.ejs", {id, subjCode, btnStatusDB, allQuesLen, timeInput, quizName, heading});
})

app.post("/teacherLogin/:id/uploads/done/:numberofOptions", async(req, res)=>{
    // const val = await quizNameDB.find({teacherID: req.params.id});
    // const quizName = val[0].quizName
    let correctAns = [];
    let options = [];
    for(let i=1; i<=(parseInt(req.params.numberofOptions)); i++){
        options.push(req.body[`opt${i}`]); 
        if(req.body[`correct${i}`]){
            correctAns.push(req.body[`opt${i}`]);
        }
    }
    console.log(req.body.quizName, req.body.heading);
    const subjTeacher = await teacherLoginDB.findById(req.params.id);
    await uploadDB.create({
        quizName: req.body.quizName,
        heading: req.body.heading,
        question: req.body.question,
        options: options,
        teacherID: req.params.id,
        subjCode: subjTeacher.subject.code,
        correctAns: correctAns,
        marksOfEachQues: req.body.marksOfEachQues,
    });
    // res.redirect(`/teacherLogin/${req.params.id}/uploads`);
    res.send("hi")
})

app.get("/teacherLogin/:id/uploads/viewAllUploads", async(req, res)=>{
    const uploadID = req.params.id;
    const ques = await uploadDB.find({teacherID: uploadID});
    // console.log(ques[0].options)
    // console.log(uploadID);
    res.render("viewAllUploads.ejs", {ques, uploadID});
})

app.post("/teacherLogin/:id/uploads/viewAllUploads/delete/:quesID", async(req, res)=>{
    await uploadDB.findByIdAndDelete(req.params.quesID);
    res.redirect(`/teacherLogin/${req.params.id}/uploads/viewAllUploads`);
})

app.post("/teacherLogin/:id/uploads/:subjCode", async(req, res)=>{
    await btnStatusDB.deleteMany({});
    await btnStatusDB.insertMany({state: true});
    res.send("quiz is live");
})

app.post("/teacherLogin/:id/uploads/:subjCode/timeInput", async(req, res)=>{
    const {id, subjCode} = req.params;
    const {timeInput} = req.body;
    await timeIntervalDB.deleteMany({teacherID: id});
    await timeIntervalDB.create({teacherID: id, timeInMins: timeInput, subjCode: subjCode});
    res.redirect(`/teacherLogin/${id}/uploads`)
})

app.get("/studentLogin/:id/MAT231CT", async (req, res) => {
    const stateVar = await btnStatusDB.find();
    const length = stateVar.length;
    const id = req.params.id;
    res.render("subjects_views/MAT231CT.ejs", {length, id});   
});

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
