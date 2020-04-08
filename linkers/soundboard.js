'use strict';

document.querySelector('#play').addEventListener('click', () => {
  play_sound();
})

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
})


let sound
let keyboardInterrupt = 2

function play_sound() {
  stop_playing()
  const {PythonShell} = require("python-shell");
  const path =  require("path")

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath : path.join(__dirname, '/file_player'),
    args: ['file_player/ae.wav']
  };


  sound = new PythonShell('play_file.py', options)

  sound.on("message", function(message) {
    console.log(message) //Print Python print statements
  })
}

function stop_playing(){
  if(sound){
    sound.terminate(keyboardInterrupt)
  }
}

