//Methodes for populating tables

import { update_table_search } from "./tableSorting.js";
import { playIcon, play_sound } from "./soundboard.js";
import { setBackButton } from "./ourMain.js";

let tree;
const path = require("path");
const fs = require("fs")
let curDir

export function update_file_list(lookup_dir) {
  curDir = lookup_dir
  if(!path.isAbsolute(lookup_dir)){
    lookup_dir = path.join(__dirname, lookup_dir)
  }
  const dirTree = require("directory-tree");
  console.log(".wav files in " + lookup_dir);
  tree = dirTree(lookup_dir, { extensions: /\.wav/ });
  //console.log(tree)
  const table = document.querySelector("#mainTableBody");
  $("#mainTableBody tr").remove(); //Clear table
  const children = tree.children;
  children.forEach(element => {
    _createRow(table, element);
  });
  update_table_search();
}

function _createRow(table, element) {
  let direction = -1;
  if (element.type === "directory") {
    direction = 0;
  }
  const row = table.insertRow(direction);
  const favoriteCell = row.insertCell(0);
  const fileNameCell = row.insertCell(1);
  const shortcutCell = row.insertCell(2);
  const playCell = row.insertCell(3);
  if (element.type === "directory") {
    favoriteCell.innerHTML = "<i class='fa fa-folder' />";
    fileNameCell.textContent = element.name;
    row.addEventListener('click', () => {
      const absPath = path.join(curDir, element.name)
      update_file_list(absPath);
      setBackButton(absPath)
    });
  }
  else { //It is a file
    favoriteCell.innerHTML = "<i class='fa fa-star' />";
    fileNameCell.textContent = element.name.split(".")[0];
    shortcutCell.textContent = "-Na-";
    playCell.innerHTML = playIcon;
    row.addEventListener('click', () => {
      play_sound(element, playCell, insertIntoFavorites);
    });
  }
}

let favoriteDict = {}
//ToDo: make persistant
const favoriteTable = document.querySelector("#favoriteTableBody");
function insertIntoFavorites(element){
  if(favoriteDict[element.name] === undefined){
    const row = favoriteTable.insertRow();
    const playCell = row.insertCell(0)
    playCell.innerHTML = playIcon
    row.insertCell(1).textContent = element.name.split(".")[0]
    row.insertCell(2).textContent ="-Na-"
    row.insertCell(3).textContent = 1
    favoriteDict[element.name] = {"count": 1, "row": row}
    row.addEventListener('click', () => {
      play_sound(element.path, playCell);
      insertIntoFavorites(element)
  });
  } else{
    const favoriteEntery = favoriteDict[element.name]
    favoriteEntery.count += 1
    favoriteEntery.row.cells[3].textContent = favoriteEntery.count

  }
}

