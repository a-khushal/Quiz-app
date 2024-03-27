const express = require("express");
const fs = require('fs');
const XLSX = require("xlsx");
const router = express.Router();
const multer  = require('multer');
const studentLoginDB = require("../../db/studentDB");
const teacherLoginDB = require("../../db/teacherDB");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileSize = parseInt(req.headers["content-length"]);
        if (fileSize > 500000) {
            return cb(new Error("File size exceeds limit"));
        }
        const directory = __dirname + '/excelFolder/';
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
        const currFileName = uniqueSuffix+'.xlsx'
        cb(null, currFileName);
        req.excelFile = currFileName;
    }
})
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500000 }
})

router
    .route("/management/uploadExcel")
    .post(upload.single("edittedFile"), async(req, res)=>{
        try{
            const filename = req.excelFile;
            const file = __dirname+"/excelFolder"+"/"+filename;
            const parse = (file)=>{
                const excelData = XLSX.readFile(file);
                return Object.keys(excelData.Sheets).map((name)=>({
                  name, 
                  data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
                }));
              }
            parse(file).forEach(async (val)=>{
                const data = val.data;
                const teacherExitst = await teacherLoginDB.findOne({email: data[0].teacherEmail});
                let teacher;
                if(teacherExitst){
                    res.send("teacher already exists!");
                    return;
                } else {
                    teacher = await teacherLoginDB.create({
                        username: data[0].teacher,
                        email: data[0].teacherEmail,
                        password: data[0].teacherPassword,
                        subject: {
                            name: data[0].subjectName,
                            code: data[0].subjectCode,
                        },
                    })
                }
                let studentsId = [];
                for(let i=1; i<data.length; i++){
                    const studentAlreadyCreated = await studentLoginDB.find({usn: data[i].USN});
                    if(studentAlreadyCreated.length>0){
                        await studentLoginDB.updateOne(
                            {usn: data[i].USN},
                            {$push: { subject: 
                                    {
                                        name: data[0].subjectName,
                                        code: data[0].subjectCode,
                                    }
                            }}
                        )
                    } else {
                        const student = await studentLoginDB.create({
                            username: data[i].studentName,
                            email: data[i].studentEmail,
                            usn: data[i].USN,
                            password: data[i].studentPassword,
                            subject: [{
                                name: data[0].subjectName,
                                code: data[0].subjectCode,
                            }],
                            branch: data[i].branch.toLowerCase(),
                        });
                        studentsId.push((student._id).toString());
                    }
                }
                await teacherLoginDB.updateOne(
                    {_id: teacher._id},
                    { $addToSet: { studentsId: { $each: studentsId } } },
                )
                res.redirect("/management");
            });
        } catch(e){
            console.log(e)
            res.send("some error");
        }
    });

module.exports = router;