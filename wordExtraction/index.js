const mammoth = require("mammoth");
const {filename, id} = require("../index");


function wordExtractor(filename, id){
    let questions;
    try{
        const opt = mammoth.extractRawText({path: `/home/khushal/Desktop/Maths_EL_SEM-III/Quiz-app/uploads/${id}/${filename}`})
            .then(function(result){
                let text = result.value; 
                const arr = text.split('\n');
                let filteredArr = arr.filter(line=> line.trim() !== '')
                const quizName = filteredArr[0].split(":")[1];
                const totalmarks = filteredArr[1].split(":")[1];
                const duration = filteredArr[2].split(":")[1];
                function splitQuestions(data) {
                    const questionArrays = [];
                    let currentIndex = 0;
                    while (currentIndex < data.length) {
                    const startIndex = data.findIndex((item, index) => index >= currentIndex && item.match(/^Question \d+ \(MC\)$/));
                    if (startIndex === -1) break;
                
                    const endIndex = data.findIndex((item, index) => index > startIndex && item.match(/^Question \d+ \(MC\)$/));
                
                    const questionArray = data.slice(startIndex, endIndex === -1 ? data.length : endIndex);
                    questionArrays.push(questionArray);
                    currentIndex = endIndex === -1 ? data.length : endIndex;
                    }
                
                    return questionArrays;
                }
                
                questions = splitQuestions(filteredArr);
                const obj = {quizName: quizName, totalmarks: totalmarks, duration: duration, questions: questions}
                return obj;
            })
        return opt;
    }
    catch(err){
        console.log(err);
    }
}

const questionsPromise = wordExtractor(filename,id);
let finalarr = [];
const expractedExport = questionsPromise.then((res) => {
    finalarr.push(res.quizName.trim())
    finalarr.push(res.totalmarks.trim())
    finalarr.push(res.duration.trim());
    let questions;
    questions = res.questions;
    for(let i=0; i<questions.length; i++){
        filteredArr = questions[i];
        let ques = '';
        let indexOfMC;
        for(let i=0; i<filteredArr.length; i++){
            if(filteredArr[i]=='MC')
                indexOfMC = i
        }
        if(indexOfMC===2)
            ques = filteredArr[1]
        else {
            for(let i=1; i<indexOfMC; i++){
                if(i!=indexOfMC-1)
                    ques += filteredArr[i]+`                    `;
                else 
                    ques += filteredArr[i];
            }
        } 

        let optarr = [];
        const marks = parseInt(filteredArr[indexOfMC+2]);
        let marksarr = [];
        let noofooptions = 0;
        for (let i = 0; i < filteredArr.length; i++) {
            if (filteredArr[i] === 'Number of options?')
            noofooptions = parseInt(filteredArr[i + 1]);
            if (filteredArr[i] === 'A' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i+1]!='B')){
                if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                    optarr.push(filteredArr[i + 1]);
                    marksarr.push(filteredArr[i+2]);
                }
                else {
                    let st=''; let j=0;
                    for(let k=i+1; filteredArr[k]!='B'; k++){
                        if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                            st+=filteredArr[k]+'                    ';
                            j=k;
                        }
                    }
                    optarr.push(st); 
                    st='';
                    marksarr.push(filteredArr[j+1]);
                }
            }
            else if (filteredArr[i] === 'B' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i + 1] !== 'C')){
                if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                    optarr.push(filteredArr[i + 1]);
                    marksarr.push(filteredArr[i+2]);
                }
                else {
                    let st=''; let j=0;
                    for(let k=i+1; filteredArr[k]!='C'; k++){
                        if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                            st+=filteredArr[k]+'                    ';
                            j=k;
                        }
                    }
                    optarr.push(st); 
                    st='';
                    marksarr.push(filteredArr[j+1]);
                }
            }
            else if (filteredArr[i] === 'C' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001'&& filteredArr[i + 1] !== 'D')){
                if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                    optarr.push(filteredArr[i + 1]);
                    marksarr.push(filteredArr[i+2]);
                }
                else {
                    let st=''; let j=0;
                    for(let k=i+1; filteredArr[k]!='D'; k++){
                        if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                            st+=filteredArr[k]+'                    ';
                            j=k;
                        }
                    }
                    optarr.push(st); 
                    st='';
                    marksarr.push(filteredArr[j+1]);
                }
            }
            else if (filteredArr[i] === 'D' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001' && filteredArr[i + 1] !== 'E')){
                if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                    optarr.push(filteredArr[i + 1]);
                    marksarr.push(filteredArr[i+2]);
                }
                else {
                    let st=''; let j=0;
                    for(let k=i+1; filteredArr[k]!='E'; k++){
                        if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                            st+=filteredArr[k]+'                    ';
                            j=k;
                        }
                    }
                    optarr.push(st);
                    st='';
                    marksarr.push(filteredArr[j+1]);
                }
            }
            else if (filteredArr[i] === 'E' && (filteredArr[i + 1] !== '000' && filteredArr[i + 1] !== '001') && i !== (filteredArr.length - 1)){
                if(filteredArr[i+2]=='000'||filteredArr[i+2]==='001'){
                    optarr.push(filteredArr[i + 1]);
                    marksarr.push(filteredArr[i+2]);
                }
                else {
                    let st=''; let j=0;
                    for(let k=i+1; k<filteredArr.length; k++){
                        if(filteredArr[k]!='000'&&filteredArr[k]!='001'){
                            st+=filteredArr[k]+'                    ';
                            j=k;
                        }
                    }
                    optarr.push(st);
                    st='';
                    marksarr.push(filteredArr[filteredArr.length-1]);
                }
            }
        }
        const optionsObj = {}; const marksObj = {}
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        for (let i = 0; i < optarr.length; i++) {
            optionsObj[alphabet[i]] = optarr[i];
        }
        for(let i=0; i<marksarr.length; i++){
            marksObj[alphabet[i]] = marksarr[i];
        }
        finalobj = {question: ques, marks: marks, enteredOptions: optionsObj, noofooptions: noofooptions, correctOrWrong: marksObj};
        finalarr.push(finalobj)
        
    }
    return finalarr

}).catch((error) => {
    console.error("Promise rejected with error:", error);
});

// module.exports = expractedExport;