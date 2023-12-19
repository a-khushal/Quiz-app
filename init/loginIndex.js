const mongoose = require("mongoose");
const data = require("./loginData");

const loginSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

main()
    .then(()=>console.log("connected"))
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/quizApp");
}

const loginDB = mongoose.model("loginDB", loginSchema);
module.exports = loginDB;

async function initDB(){
    await loginDB.deleteMany({});
    await loginDB.insertMany(data.UserData);
}

initDB();




