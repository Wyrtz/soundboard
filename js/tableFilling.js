//Methodes for populating tables

import { update_table_search } from "./tableSorting.js";
import { playIcon, play_sound } from "./soundboard.js";
import { setBackButton } from "./ourMain.js";


let tree;
const favoriteTable = document.querySelector("#favoriteTableBody");
const path = require("path");
const fs = require("fs")
let curDir

//Save the favorites table on close
const { remote } = require('electron');
const fileName = "favorites.json"
const filePath = path.join(__dirname, fileName)
remote.getCurrentWindow().on("close", saveFavoritesToDisk)

//Load the favorites
let favoriteDict = {}
if (fs.existsSync(filePath)) {
  loadFavoritesFromDisk()
} 

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
    favoriteCell.innerHTML = "<i class='fa fa-file' />";
    fileNameCell.textContent = element.name.split(".")[0];
    shortcutCell.textContent = "-Na-";
    playCell.innerHTML = playIcon;
    row.addEventListener('click', () => {
      play_sound(element, playCell, insertIntoFavorites);
    });
  }
}

function insertIntoFavorites(leaf, count){
  if(count === undefined){
    count = 1
  }
  if(favoriteDict[leaf.name] === undefined){ //Not played before
    const row = favoriteTable.insertRow();
    const playCell = row.insertCell(0)
    playCell.innerHTML = playIcon
    row.insertCell(1).textContent = leaf.name.split(".")[0]
    row.insertCell(2).textContent ="-Na-"
    row.insertCell(3).textContent = count
    
    row.addEventListener('click', () => {
      play_sound(leaf, playCell, insertIntoFavorites);
  });
    favoriteDict[leaf.name] = {"count": 1, "row": row, "leaf": leaf}
  } else{
    const favoriteEntery = favoriteDict[leaf.name]
    favoriteEntery.count += 1
    favoriteEntery.row.cells[3].textContent = favoriteEntery.count
  }
}

function saveFavoritesToDisk(){
  fs.writeFileSync(filePath, JSON.stringify(favoriteDict))
}

function loadFavoritesFromDisk(){
  const tmpDict = JSON.parse(fs.readFileSync(filePath))
  console.log(tmpDict)
  console.log(Object.keys(tmpDict))
  Object.keys(tmpDict).forEach(key => {
    insertIntoFavorites(tmpDict[key].leaf, tmpDict[key].count)
  });
}


