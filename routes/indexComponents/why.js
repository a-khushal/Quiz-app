const express = require("express");
const router = express.Router();

router.get('/why',(req,res)=>{
    res.render("../views/why.ejs");
});

module.exports = router;