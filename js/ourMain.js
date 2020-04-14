//Main file 
const {dialog} = require('electron').remote;
import { update_file_list } from "./tableFilling.js";
import { stop_playing } from "./soundboard.js";

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
});

document.querySelector('#update').addEventListener('click', () => {
  const res = dialog.showOpenDialogSync({
    title: "Pick a folder",
    buttonLabel: "Pick this folder",
    properties: ['openFile', 'openDirectory']
    });
    if (res !== undefined) {
      update_file_list(res[0]);
    }
});

//Load in files from sound_files
const path = require("path");
const fs = require("fs")
const dir = path.join(__dirname, "sound_files");
if (fs.existsSync(dir)) {
  update_file_list(dir)
}

