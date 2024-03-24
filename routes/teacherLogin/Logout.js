// Assuming you have Express.js set up
const express = require('express');
const router = express.Router();

// GET route for displaying the logout button
router.get('/teacherLogin/:id/Logout', (req, res) => {
    // Assuming you pass the teacher's ID to the EJS file as 'id'
    const id = req.params.id;
    res.render('your_ejs_file_name', { id: id });
});

module.exports = router;
