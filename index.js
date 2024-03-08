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

const btnStatusDB = mongoose.model('btnStatusDB', btnStatusSchema);
const timeIntervalDB = mongoose.model("timeIntervalDB", timeSchema);
const responseDB = mongoose.model("responseDB", responsesSchema);
const quizNameDB = mongoose.model("quizNameDB", quizNameSchema);
module.exports = {btnStatusDB, timeIntervalDB, responseDB, quizNameDB};

const rootRouter = require("./routes/index")
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
