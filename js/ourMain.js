//Main file 

import { update_file_list } from "./tableFilling.js";
import { stop_playing } from "./soundboard.js";

document.querySelector('#stop').addEventListener('click', () => {
  stop_playing();
});

document.querySelector('#update').addEventListener('click', () => {
  update_file_list("");
});

update_file_list("")