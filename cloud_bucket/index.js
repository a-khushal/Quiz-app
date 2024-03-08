// keyID: 0050231ddf437600000000002
// keyName: B2-key
// applicationKey: K005MIgV6jnUyDlhxi5MuHvrAUmDGVM

const AWS = require("aws-sdk");
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: "0050231ddf437600000000002",
    secretAccessKey: "K005MIgV6jnUyDlhxi5MuHvrAUmDGVM",
    endpoint: "https://quizApp.s3.us-east-005.backblazeb2.com"
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