// // your-script.js
// import * as mke from 'https://cdn.jsdelivr.net/npm/mathkeyboardengine@v1.1.0/dist/MathKeyboardEngine.es2017-esm.min.js';

// document.addEventListener('DOMContentLoaded', function() {
// let latexConfiguration = new mke.LatexConfiguration();
// let keyboardMemory = new mke.KeyboardMemory();

// // Create a button to trigger the virtual keyboard
// const showKeyboardBtn = document.getElementById('showKeyboardBtn');
// const mathKeyboardContainer = document.getElementById('mathKeyboardContainer');

// // Event listener for the button click
// showKeyboardBtn.addEventListener('click', function() {
//     // Create and initialize the virtual keyboard
//     const mathKeyboard = new mke.Keyboard(latexConfiguration, keyboardMemory);
//     mathKeyboard.init();

//     // Append the virtual keyboard to the container
//     mathKeyboardContainer.innerHTML = '';
//     mathKeyboardContainer.appendChild(mathKeyboard.getElement());

//     // Optionally, you can subscribe to events here if needed
//     mathKeyboard.on('keypress', function(key) {
//     console.log('Key pressed:', key);
//     });
// });
// });

// let i=0;
// setInterval(()=>{
//     i++;
//     console.log(i);
// }, 1000)




// function synchronousSetInterval(callback, interval) {
//     let isExecuting = false;
  
//     function runCallback() {
//       isExecuting = true;
//       callback();
//       isExecuting = false;
//       setTimeout(runCallback, interval);
//     }
  
//     runCallback();
  
//     return {
//       stop: function () {
//         // Optionally, you can provide a way to stop the "interval"
//         isExecuting = false;
//       },
//     };
//   }
  
//   function delay(milliseconds) {
//     return new Promise(resolve => setTimeout(resolve, milliseconds));
//   }
  
//   async function main() {
//     const mySynchronousInterval = synchronousSetInterval(() => {
//       console.log("Executing...");
//     }, 1000);
  
//     // Wait for 60 seconds
//     await delay(5000);
  
//     console.log("hi");
//   }
  
//   main();
  

// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function synchronousDelay() {
//   console.log("Start of synchronousDelay");

//   // Simulating a 60-second delay
//   await delay(60000);

//   console.log("End of synchronousDelay");
//   console.log("hi");
// }

// // Example usage
// synchronousDelay();


setTimeout(() => {
  console.log("Hi")
}, 5000);