const mongoose = require("mongoose");
const {btnStatusDB} = require('./index');

main()
    .then(()=>{
        console.log("connected")
    })
    .catch((err)=>{
        console.log(err)
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

