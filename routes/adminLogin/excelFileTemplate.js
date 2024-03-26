const express = require("express");
const router = express.Router();
const fs = require('fs');


router
    .route("/management/downloadExcel")
    .post(async(req, res)=>{
        try{
            const filePath = __dirname+'/Book.xlsx';
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath, { 
                    headers: {
                        'Content-Disposition': 'attachment; filename="book.xlsx"'
                    }
                }, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Error sending file');
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