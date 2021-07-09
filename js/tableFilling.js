//Methodes for populating tables
const { globalShortcut} = require('electron').remote;
import { update_table_search} from "./tableSorting.js";
import { playIcon, play_sound, stop_playing } from "./jsSoundboard.js";
import { setBackButton } from "./ourMain.js";


export let tree;
const favoriteTable = document.querySelector("#favoriteTableBody");
const mianTable = document.querySelector("#mainTableBody");
const path = require("path");
const fs = require("fs")
const dirTree = require("directory-tree");
const trashIcon = "<i class='fa fa-trash'/>"
export let curDir

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
  //console.log(".wav files in " + lookup_dir);
  tree = dirTree(lookup_dir, { extensions: /\.wav|\.mp3|\.flack|\.PCM|\.AIFF|\.AAC|\.OGG|\.WMA|\.ALAC/i });
  //console.log(tree)
  clearMainTable()
  const children = tree.children;
  children.forEach(element => {
    _createRow(mianTable, element);
  });
  update_table_search();
}

export function addAll(dirTree){
  dirTree.forEach(element => {
    if(element.type === "directory"){
      addAll(element.children)
    }
      _createRow(mianTable, element);
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
    fileNameCell.textContent = getFileNameWithoutExtention(element.name)
    shortcutCell.textContent = "-Na-";
    playCell.innerHTML = playIcon;
    row.addEventListener('click', () => {
      play_sound(element, playCell, insertIntoFavorites);
    });
  }
}

function deleteFromFavorites(entryName, entryRow){
  delete favoriteDict[entryName]
  entryRow.remove()
}

function insertIntoFavorites(leaf, count){
  let entery = favoriteDict[leaf.name]
  if(count === undefined){ //If count != undefined: we are creating from file
    count = 1
  }
  if(entery === undefined){ //Not played before (this session)
    favoriteDict[leaf.name] = {"count": count, "leaf": leaf}
  } else { //Played before, count up 1 
    count = entery.count + 1
    favoriteDict[leaf.name].count = count
  }
  
  //Find the row and update its count
  for(let i = 0; i < favoriteTable.rows.length; i++){
    if(favoriteTable.rows[i].cells[1].innerText === leaf.name.split(".")[0]){
      favoriteTable.rows[i].cells[2].innerHTML = count + trashIcon
      sortFavoritesByPlays()
      return
    }
  }

  if(favoriteTable.rows.length >= 10){ //Don't insert if not new top 10
    const lowestEntery = parseInt(favoriteTable.rows[9].cells[2].innerText)
    if(lowestEntery > count){
      return
    } else{
      favoriteTable.deleteRow(9)//Make room for new entry with same amount of plays
    }
  } 

  const row = favoriteTable.insertRow();
  const playCell = row.insertCell(-1)
  playCell.innerHTML = playIcon
  row.insertCell(1).textContent = leaf.name.split(".")[0]
  row.insertCell(2).innerHTML = count + trashIcon
  for (let index = 0; index < row.cells.length -1; index++) {
    row.cells[index].addEventListener('click', () => {
      play_sound(leaf, playCell, insertIntoFavorites);
    })
  }
  row.cells[2].addEventListener('click', () => {
    deleteFromFavorites(leaf.name, row)
  });
  sortFavoritesByPlays()
}

function saveFavoritesToDisk(){
  fs.writeFileSync(filePath, JSON.stringify(favoriteDict))
}

function loadFavoritesFromDisk(){
  const tmpDict = JSON.parse(fs.readFileSync(filePath))
  Object.keys(tmpDict).forEach(key => {
    insertIntoFavorites(tmpDict[key].leaf, tmpDict[key].count)
  });
}

function sortFavoritesByPlays(){
  $("#count").click()
  const favrows = favoriteTable.rows
  for(let i = 0; i < favrows.length; i++){
    globalShortcut.register("CommandOrControl+num" + i, () => {
      favrows[i].cells[0].click()
    })
  }

}

export function clearMainTable(){
  $("#mainTableBody tr").remove(); //Clear table
}

function getFileNameWithoutExtention(fileName){
  return fileName.split(".").slice(0,-1).join(".")
}