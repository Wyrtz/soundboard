/* Different methods for sorting tables
*
*/


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

//Sort according to column header
//Curtesy of https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
/*const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
// do the work...
document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const table = th.closest('table');
  const tbody = table.querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => tbody.appendChild(tr));
})));*/

$('th').click(sort)

export function sort(){
  var table = $(this).parents('table').eq(0)
  var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
  this.asc = !this.asc
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