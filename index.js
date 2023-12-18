const express = require("express");
const app = express();
const path = require("path")

app.use(express.urlencoded({extended: true}));
app.set(express.static(path.join(__dirname, "/views")));

app.get("/", (req, res)=>{
    res.send("I am root route");
});

app.get("/login", (req, res)=>{
    res.render("login.ejs")
});

app.listen(8080, ()=>{
    console.log("listening to port 8080");
});