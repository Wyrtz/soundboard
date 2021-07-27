/* Different methods for sorting tables
*
*/
import { addAll, update_file_list, clearMainTable, curDir, tree } from "./tableFilling.js";
var $rows;
export function update_table_search() {
  $rows = $('#mainTableBody tr');
}

//Search
//Curtesy https://stackoverflow.com/questions/9127498/how-to-perform-a-real-time-search-and-filter-on-a-html-table
$('#search').keyup(function () {
  if (!$rows) {
    return;
  }
  //Click the first on enter (13), and F[x] keys for the rest
  if(112 <= event.keyCode <= 123 || event.keyCode === 13){
    event.preventDefault();
    const rows = document.querySelector("#mainTableBody").rows
    const lookingFor =  event.keyCode === 13 ? 0 : event.keyCode - 112
    let at = 0
    for(let i = 0; i < rows.length; i++){
      if(rows[i].style.display !== "none"){
        if(at === lookingFor){
          rows[i].click()
          return
        }
        at = at + 1
      }
    };  //Click the first on enter (13)
  }
  var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
  $rows.show().filter(function () {
    var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
    return !~text.indexOf(val);
  }).hide();
});

let allSFilesAdded = false

$('#search').keyup(function () {
  const curVal = $(this).val()
  if(curVal === ""){ //Searchbar empty
    update_file_list(curDir)
    allSFilesAdded = false
    return
  }
  if(!allSFilesAdded){ //"Searchbar not empty"
    clearMainTable()
    addAll(tree.children)
    allSFilesAdded = true
  }
  labelMainShortcuts()
});

//Curtesy of https://stackoverflow.com/questions/3160277/jquery-table-sort/17805499#17805499 (Nick Grealy)
$('th').click(sort)
$('#count').click({direction: "asc"}, sort)

export function sort(args){
  var table = $(this).parents('table').eq(0)
  var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
  if(args.direction !== "asc"){
    this.asc = !this.asc
  } 
  if (!this.asc){rows = rows.reverse()}
  for (var i = 0; i < rows.length; i++){table.append(rows[i])}
}

function comparer(index) {
  return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
  }
}

function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

export function labelMainShortcuts(){
  const visRows = $('tr:visible','#mainTable')
  const len = (visRows.length - 1) < 12 ? (visRows.length - 1) : 12
  for (var i = 1; i <= len; i++){
    visRows[i].cells[2].innerText = "F" + i
  }
}