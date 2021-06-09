//Main file 
//Imports
const {dialog, globalShortcut, BrowserWindow, getCurrentWindow} = require('electron').remote;
import { update_file_list } from "./tableFilling.js";
import { stop_playing } from "./jsSoundboard.js";
import { defaultSettings } from "./defaultSettings.js";
const path = require("path");
const fs = require("fs")

//Btns and HTML elements
const favoriteTable = document.querySelector("#favoriteTableBody");
const updateBtn = document.querySelector('#update')
const updateBtnText = document.querySelector("#buttonText")

//Event listeners
document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
});

updateBtn.addEventListener('click', setFolderLookupFunctionality);

//Constants
let root
let prev
let settings;

//Load settings
if (fs.existsSync('settings.json')) {
  settings = JSON.parse(fs.readFileSync('settings.json'))
} else{
  settings = defaultSettings
}

//Functions
//Folderpicker
function setFolderLookupFunctionality() {
  const res = dialog.showOpenDialogSync({
    title: "Pick a folder",
    buttonLabel: "Pick this folder",
    properties: ['openFile', 'openDirectory']
  });
  if (res !== undefined) {
    prev, root = res[0]
    settings.audioFileFolder = root
    update_file_list(res[0]);
  }
}

/*The functionality of upadteBtn, after it has been altered. (It is now a back button) 
Changes back to folderpicker when reaching root folder after pressing back enough times*/
function backButtonFunctionality(){
  update_file_list(prev)
  prev = path.join(prev, "..")
  if (prev <= root){
    updateBtnText.textContent = "Get them files"
    updateBtn.removeEventListener("click", backButtonFunctionality, false)
    updateBtn.addEventListener('click', setFolderLookupFunctionality);
  }
}

//Change updateBtn functionality to become a back button
export function setBackButton(p){
  prev = path.join(p, "..")
  updateBtn.removeEventListener('click', setFolderLookupFunctionality, false)
  updateBtnText.textContent = "Back"
  updateBtn.addEventListener('click', backButtonFunctionality)
}

//Load the files into the table
const dir = settings.audioFileFolder;
if (fs.existsSync(dir)) {
  prev, root = __dirname
  update_file_list(dir)
}

//On close
const filePath = path.join(__dirname, settings.settingsFileName)
getCurrentWindow().on("close", () => {
  defaultSettings.audioFileFolder = root
  fs.writeFileSync(filePath, JSON.stringify(settings))
})

//Shortcuts
//https://github.com/ccampbell/mousetrap/tree/master/ 

/*for(let i = 0; i < favoriteTable.rows.length; i++){
  //favoriteTable.rows[i]
  registerShortcut(i)
}
favoriteTable.rows

export function registerShortcut(idx){
  globalShortcut.register('CommandOrControl+num' + idx, () => {
    favoriteTable.rows[idx].click()
  })
}*/

globalShortcut.register("CommandOrControl+numsub", () => {
  $("#stop").click()
})

globalShortcut.register("CommandOrControl+Shift+l", () => {
  const window = BrowserWindow.getAllWindows()[0]
  window.show()
  $("#search").focus()
})

BrowserWindow.getAllWindows()[0].on("browser-window-focus", () => {
  $("#search").focus()
})

//Set focus to the search bar to start with
$("#search").focus()