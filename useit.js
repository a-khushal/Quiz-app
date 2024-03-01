// // // your-script.js
// // import * as mke from 'https://cdn.jsdelivr.net/npm/mathkeyboardengine@v1.1.0/dist/MathKeyboardEngine.es2017-esm.min.js';

// // document.addEventListener('DOMContentLoaded', function() {
// // let latexConfiguration = new mke.LatexConfiguration();
// // let keyboardMemory = new mke.KeyboardMemory();

// // // Create a button to trigger the virtual keyboard
// // const showKeyboardBtn = document.getElementById('showKeyboardBtn');
// // const mathKeyboardContainer = document.getElementById('mathKeyboardContainer');

// // // Event listener for the button click
// // showKeyboardBtn.addEventListener('click', function() {
// //     // Create and initialize the virtual keyboard
// //     const mathKeyboard = new mke.Keyboard(latexConfiguration, keyboardMemory);
// //     mathKeyboard.init();

// //     // Append the virtual keyboard to the container
// //     mathKeyboardContainer.innerHTML = '';
// //     mathKeyboardContainer.appendChild(mathKeyboard.getElement());

// //     // Optionally, you can subscribe to events here if needed
// //     mathKeyboard.on('keypress', function(key) {
// //     console.log('Key pressed:', key);
// //     });
// // });
// // });

// // let i=0;
// // setInterval(()=>{
// //     i++;
// //     console.log(i);
// // }, 1000)




// // function synchronousSetInterval(callback, interval) {
// //     let isExecuting = false;
  
// //     function runCallback() {
// //       isExecuting = true;
// //       callback();
// //       isExecuting = false;
// //       setTimeout(runCallback, interval);
// //     }
  
// //     runCallback();
  
// //     return {
// //       stop: function () {
// //         // Optionally, you can provide a way to stop the "interval"
// //         isExecuting = false;
// //       },
// //     };
// //   }
  
// //   function delay(milliseconds) {
// //     return new Promise(resolve => setTimeout(resolve, milliseconds));
// //   }
  
// //   async function main() {
// //     const mySynchronousInterval = synchronousSetInterval(() => {
// //       console.log("Executing...");
// //     }, 1000);
  
// //     // Wait for 60 seconds
// //     await delay(5000);
  
// //     console.log("hi");
// //   }
  
// //   main();
  

// // function delay(ms) {
// //   return new Promise(resolve => setTimeout(resolve, ms));
// // }

// // async function synchronousDelay() {
// //   console.log("Start of synchronousDelay");

// //   // Simulating a 60-second delay
// //   await delay(60000);

// //   console.log("End of synchronousDelay");
// //   console.log("hi");
// // }

// // // Example usage
// // synchronousDelay();


// // setTimeout(() => {
// //   console.log("Hi")
// // }, 5000);


// const rawData = {
//   'quesId 65ad5cec68ffd3b697223a46': '65ad5cec68ffd3b697223a46',
//   'option 65ad5cec68ffd3b697223a46': ['on', 'on'],
//   'quesId 65b3a29a636b814accf5d200': '65b3a29a636b814accf5d200',
//   'option 65b3a29a636b814accf5d200': ['on', 'on']
// };

// // Initialize an object to store the formatted data
// const formattedData = {};

// // // Iterate over the keys in the raw data
// // for (const key in rawData) {
// //   // Extract the question ID from the key
// //   // const questionId = key.replace(/^quesId/, '');

// //   // // Determine whether the key represents a question ID or an option
// //   // if (key.startsWith('quesId')) {
// //   //   // If it's a question ID, create a new entry in the formatted data object
// //   //   // formattedData[questionId] = { id: rawData[key], options: [] };}
// //   if (key.startsWith('option')) {
// //     // If it's an option, make sure the corresponding question's object exists
// //     console.log(key.split(' ')[1])
// //     id = key.split(' ')[1];
// //     formattedData[id] = rawData[key]
// //     // if (!formattedData[questionId]) {
// //     //   formattedData[questionId] = { id: (questionId.split(' '))[1], options: [] };
// //     // }
// //     // // Add the option to the corresponding question's options array
// //     // formattedData[questionId].options.push(rawData[key]);
// //   }
// // }

// // console.log(formattedData);



// // const quizQuestions = [
// //   "1What is the capital of France?",
// //   "1Who wrote 'Romeo and Juliet'?",
// //   "1What is the chemical symbol for water?",
// //   "2What is the capital of France?",
// //   "2Who wrote 'Romeo and Juliet'?",
// //   "2What is the chemical symbol for water?",
// //   "3What is the capital of France?",
// //   "3Who wrote 'Romeo and Juliet'?",
// //   "3What is the chemical symbol for water?",
// //   // Add more questions as needed
// // ];

// // const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5);
// // console.log(shuffledQuestions);



// // const words = ['spray', 'elite', 'exuberant', 'destruction', 'present'];
// const words = [
//   {
//     name: "abc",
//     code: "kjla",
//   },
//   {
//     name: "abc",
//     code: "kjla",
//   },
//   {
//     name: "",
//     code: "",
//   },
//   {
//     name: "",
//     code: "",
//   }
// ];

// const result = words.filter((word) => word.name !== "" && word.code !== "");

// console.log(result);





const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    const filePath = '/home/khushal/Desktop/Document.docx';
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { 
            headers: {
                'Content-Disposition': 'attachment; filename="template.docx"'
            }
        }, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('File sent successfully');
            }
        });
    } else {
        console.error('Error: File not found');
        res.status(404).send('File not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
