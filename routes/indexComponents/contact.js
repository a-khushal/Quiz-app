const express = require("express");
const router = express.Router();

router.get('/contact',(req,res)=>{
    res.render("../views/contact.ejs");
});

module.exports = router;