//File for playing sound bits

'use strict';

export const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"

let sound
let keyboardInterrupt = 2
let curRow
let isPlaying = false

export function play_sound(soundFile, playCell) {
  if(curRow){
    console.log()
    curRow.innerHTML = playIcon
    if(isPlaying && curRow == playCell){
      stop_playing()
      return
    }
  }
  curRow = playCell
  stop_playing()
  playCell.innerHTML = stopIcon
  isPlaying = true
  const {PythonShell} = require("python-shell");
  const path =  require("path")
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath : path.join(__dirname, '/file_player'),
    args: [soundFile]
  };
  sound = new PythonShell('play_file.py', options)

  sound.on("message", function(message) {
    console.log(message) //Print Python print statements
    if(message === "Done"){
      console.log("Got it bro!")
      curRow.innerHTML = "<i class='fa fa-play' />"
      isPlaying = false
    }
  })
}

export function stop_playing(){
  if(sound){
    curRow.innerHTML = playIcon
    sound.terminate(keyboardInterrupt)
    isPlaying = false
  }
}