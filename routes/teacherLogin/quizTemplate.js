const express = require("express");
const router = express.Router();
const fs = require('fs');

router
    .route("/teacherLogin/:id/quizTemplate")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            res.render('../views/template.ejs', {id});
            // process.exit(0);
            // process.emit('SIGUSR2');
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "An error occurred" });
        }
    })
    .post(async(req, res)=>{
        try{
            const filePath = __dirname+'/Document.docx';
            console.log(__dirname);
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
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "An error occurred" });
        }
    })


module.exports = router;