//Main file 
const {dialog, globalShortcut, BrowserWindow} = require('electron').remote;
import { update_file_list } from "./tableFilling.js";
import { stop_playing } from "./jsSoundboard.js";

const favoriteTable = document.querySelector("#favoriteTableBody");
const updateBtn = document.querySelector('#update')
const updateBtnText = document.querySelector("#buttonText")

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
});

updateBtn.addEventListener('click', setFolderLookupFunctionality);

let root
let prev
function setFolderLookupFunctionality() {
  const res = dialog.showOpenDialogSync({
    title: "Pick a folder",
    buttonLabel: "Pick this folder",
    properties: ['openFile', 'openDirectory']
  });
  if (res !== undefined) {
    prev, root = res[0]
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

//Load in files from sound_files
const path = require("path");
const fs = require("fs")
const dir = path.join(__dirname, "sound_files");
if (fs.existsSync(dir)) {
  prev, root = __dirname
  update_file_list(dir)
}

//Shortcuts
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

$("#search").focus()

//https://github.com/ccampbell/mousetrap/tree/master/ 