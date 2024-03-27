const AWS = require("aws-sdk");
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: ""
})

const uploadFile = async (fileName, localFilePath) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "quizApp",
        Key: fileName,
    }).promise();
    console.log(response);
}

module.exports = uploadFile;