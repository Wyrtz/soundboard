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
  if(!allSFilesAdded){
    clearMainTable()
    addAll(tree.children)
    allSFilesAdded = true
  }

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