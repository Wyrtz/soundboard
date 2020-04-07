'use strict';

document.querySelector('.button').addEventListener('click', () => {
  document.querySelector("#title").textContent = "test";
  console.log("help");
})

function play_sound() {
  const python = require("python-shell")
  const path =  require("path")

  const options = {
    scriptPath : path.join(__dirname, '../../')
    args : '-f "ae.wav"'
  }

  const sound = new python('play_file.py', options)
}