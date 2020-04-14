'use strict';

import {update_table_search} from"./tableSorting.js"

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
})

document.querySelector('#update').addEventListener('click', () => {
  update_file_list("");
})


const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"

let tree
function update_file_list(lookup_dir) {
  const dirTree = require("directory-tree");
  const path =  require("path");
  const dir = path.join(__dirname, "sound_files", lookup_dir)
  console.log(".wav files in " + dir)
  tree = dirTree(dir, { extensions: /\.wav/ })
  //console.log(tree)
  const table = document.querySelector("#mainTableBody");

  $("#mainTableBody tr").remove(); //Clear table

  const children = tree.children
  children.forEach(element => {
    createRow(table, element);
  });
  update_table_search()
}

function createRow(table, element) {
  let direction = -1
  if(element.type === "directory"){
    direction = 0
  }
  const row = table.insertRow(direction);
  const favoriteCell = row.insertCell(0);
  const fileNameCell = row.insertCell(1);
  const shortcutCell = row.insertCell(2);
  const playCell = row.insertCell(3);
  if(element.type === "directory"){
    favoriteCell.innerHTML = "<i class='fa fa-folder' />"
    fileNameCell.innerHTML = element.name
    row.addEventListener('click', () => {
      update_file_list(element.name);
    })
  }else{ //It is a file
    favoriteCell.innerHTML = "<i class='fa fa-star' />";
    fileNameCell.innerHTML = element.name.split(".")[0];
    shortcutCell.innerHTML = "-Na-";
    playCell.innerHTML = playIcon;
    row.addEventListener('click', () => {
      play_sound(element.path, playCell);
    });
  }
}

let sound
let keyboardInterrupt = 2
let curRow
let isPlaying = false

function play_sound(soundFile, playCell) {
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

function stop_playing(){
  if(sound){
    curRow.innerHTML = playIcon
    sound.terminate(keyboardInterrupt)
    isPlaying = false
  }
}

update_file_list("")