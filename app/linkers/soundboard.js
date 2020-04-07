'use strict';

document.querySelector('.button').addEventListener('click', () => {
  play_sound();
})

function play_sound() {
  const {PythonShell} = require("python-shell");
  const path =  require("path")

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath : path.join(__dirname, '../'),
    args: ['../ae.wav']
  };

  const sound = new PythonShell('play_file.py', options)

  sound.on("message", function(message) {
    console.log(message) //Print Python print statements
  })
}

