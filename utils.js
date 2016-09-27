"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
/*
 * getValue is used to get the value of any child in an object.
 *
 * For example:
 *    say object = { a: { b: { c: "some value" }}
 *    then getValue(object, 'a.b.c')  -> "some value"
 */
function recur(obj, keys, i) {
   var val = obj[keys[i]];
   if (val === undefined) return "";
   if (keys.length === i + 1) return val;
   return recur(val, keys, i + 1);
}
var getValue = exports.getValue = function getValue(obj, key) {
   var keys = key.split(".");
   return recur(obj, keys, 0);
};

var sortItems = exports.sortItems = function sortItems(items, key, asc) {
   var L = asc ? -1 : 1;
   var R = asc ? 1 : -1;
   return items.sort(function (a, b) {
      var A = getValue(a, key);
      var B = getValue(b, key);
      if (A < B) return L;
      if (A > B) return R;
      return 0;
   });
};

/*
 * This function filters the items by the searches, as well as the
 * filters in the columns.
 */
var filterItems = exports.filterItems = function filterItems(items, allColumns) {

   var columns = allColumns.filter(function (x) {
      return x.searchable && x.search != "" || x.selections;
   });

   return items.filter(function (item) {

      for (var c in columns) {
         var _columns$c = columns[c];
         var key = _columns$c.key;
         var search = _columns$c.search;
         var selections = _columns$c.selections;

         var val = getValue(item, key);

         // if the column is filterable
         if (selections) {
            // if the column has filters specified
            if (selections.length > 0) {

               // if none of the filters matches the value
               if (selections.indexOf(val) < 0) return false;
            }
         } else {

            search = search.toLowerCase();

            if (typeof val === "boolean") {
               if (val) {
                  // you can search for a true boolean by 1 or by the word 'true'
                  if (search != "1" && "true".indexOf(search) < 0) return false;
               } else if (search != "0" && "false".indexOf(search) < 0) return false;
            } else if (typeof val === "number") {
               val = val.toString();
            } else if (typeof val === "string") {
               val = val.toLowerCase();
            }

            if (!val) {
               val = "";
            }

            if (val.indexOf(search) < 0) return false;
         }
      }
      return true;
   });
};

/*
 * downloads table in a spreadsheet format
 */
var exportTable = exports.exportTable = function exportTable(items, columns, name) {

   var renderColumns = columns.filter(function (x) {
      return x.key != undefined;
   });

   var header = renderColumns.map(function (column) {
      return "  <ss:Cell>\n" + "    <ss:Data ss:Type='String'>" + column.name + "</ss:Data>\n" + "  </ss:Cell>\n";
   }).join("");

   var body = items.map(function (item) {
      return "<ss:Row>\n" + renderColumns.map(function (column) {
         var val = getValue(item, column.key);
         return "  <ss:Cell>\n" + ("    <ss:Data ss:Type=\"" + (typeof val === "number" ? "Number" : "String") + "\">") + val + "</ss:Data>\n" + "  </ss:Cell>\n";
      }).join("") + "</ss:Row>\n";
   }).join("");

   var table = "<?xml version=\"1.0\"?>\n" + "<ss:Workbook xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">\n" + "<ss:Worksheet ss:Name=\"Sheet1\">\n" + "<ss:Table>\n\n" + "<ss:Row>\n" + header + "</ss:Row>\n" + body + "\n</ss:Table>\n" + "</ss:Worksheet>\n" + "</ss:Workbook>\n";

   var blob = new Blob([table], {
      "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
   });

   // creates a temporary hidden anchor on the page
   var a = document.createElement("a");
   a.style = "display: none";

   // adds the blob to the anchor
   var url = URL.createObjectURL(blob);
   a.href = url;

   // adds the table name to the downloaded file.  If none specified, the name is 'table'
   if (!name) name = "table";
   a.download = name + ".xls";

   // adds the anchor, click it, and removes it
   document.body.appendChild(a);
   a.click();
   a.parentNode.removeChild(a);
   window.URL.revokeObjectURL(url);
};