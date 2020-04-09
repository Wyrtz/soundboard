'use strict';

var $rows

function update_table_search(){
  $rows = $('#mainTable tr');
}

//Curtesy https://stackoverflow.com/questions/9127498/how-to-perform-a-real-time-search-and-filter-on-a-html-table
$('#search').keyup(function() {
    if(!$rows){return}
    console.log("key up!")
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// Cortesy of https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const table = th.closest('table');
  const tbody = table.querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => tbody.appendChild(tr) );
})));

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
})

document.querySelector('#update').addEventListener('click', () => {
  update_file_list("");
})

let tree
const playIcon = "<i class='fa fa-play' />"
const stopIcon = "<i class='fa fa-stop' />"

function update_file_list(lookup_dir) {
  const dirTree = require("directory-tree");
  const path =  require("path");
  const dir = path.join(__dirname, "sound_files", lookup_dir)
  console.log(".wav files in " + dir)
  tree = dirTree(dir, { extensions: /\.wav/ })
  //console.log(tree)
  const table = document.querySelector("#mainTable");

  $("#mainTable tr").remove(); //Clear table

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