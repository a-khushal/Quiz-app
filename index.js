const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const loginDB = require("./init/loginIndex");

app.use(express.urlencoded({extended: true}));
app.set(express.static(path.join(__dirname, "/views")));

main()
    .then(()=>console.log("connected"))
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}


app.get("/", (req, res)=>{
    res.render("index.ejs");
});

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.post("/", async(req, res)=>{
    try{
        let {email, password} = req.body;
        let check = await loginDB.findOne({email, password});
        if(check!=null){
            res.send("after login");
            return;
        }
        res.send("User doen't exist");
        
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(8080, ()=>{
    console.log("listening to port 8080");
});