// your-script.js
import * as mke from 'https://cdn.jsdelivr.net/npm/mathkeyboardengine@v1.1.0/dist/MathKeyboardEngine.es2017-esm.min.js';

document.addEventListener('DOMContentLoaded', function() {
let latexConfiguration = new mke.LatexConfiguration();
let keyboardMemory = new mke.KeyboardMemory();

// Create a button to trigger the virtual keyboard
const showKeyboardBtn = document.getElementById('showKeyboardBtn');
const mathKeyboardContainer = document.getElementById('mathKeyboardContainer');

// Event listener for the button click
showKeyboardBtn.addEventListener('click', function() {
    // Create and initialize the virtual keyboard
    const mathKeyboard = new mke.Keyboard(latexConfiguration, keyboardMemory);
    mathKeyboard.init();

    // Append the virtual keyboard to the container
    mathKeyboardContainer.innerHTML = '';
    mathKeyboardContainer.appendChild(mathKeyboard.getElement());

    // Optionally, you can subscribe to events here if needed
    mathKeyboard.on('keypress', function(key) {
    console.log('Key pressed:', key);
    });
});
});


