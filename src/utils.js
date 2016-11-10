/*
 * getValue is used to get the value of any child in an object.
 *
 * For example:
 *    say object = { a: { b: { c: "some value" }}
 *    then getValue(object, 'a.b.c')  -> "some value"
 */
function recur(obj, keys, i) {
   if(obj === null) return "";
   const val = obj[keys[i]];
   if(val === undefined) return "";
   if(keys.length === i + 1) return val;
   return recur(val, keys, i + 1);
}
export const getValue = (obj, key) => {
   const keys = key.split(".");
   return recur(obj, keys, 0);
};

export const sortItems = (items, key, asc) => {
   const L = asc ? -1 : 1;
   const R = asc ? 1 : -1;
   return items.sort((a, b) => {
      let A = getValue(a, key) || "";
      let B = getValue(b, key) || "";
      if(typeof A == "string") A = A.toLowerCase();
      if(typeof B == "string") B = B.toLowerCase();
      if(A < B) return L;
      if(A > B) return R;
      return 0;
   });
};

/*
 * This function filters the items by the searches, as well as the
 * filters in the columns.
 */
export const filterItems = (items, allColumns) => {

   const columns = allColumns.filter(x => (x.searchable && x.search != "") || x.selections);

   return items.filter(item => {

      for(var c in columns) {
         let { key, search, selections } = columns[c];
         let val = getValue(item, key);

         // if the column is filterable
         if(selections) {
            // if the column has filters specified
            if(selections.length > 0) {

               // if none of the filters matches the value
               if(selections.indexOf(val) < 0) return false;
            }
         }

         else {

            search = search.toLowerCase();

            if (typeof val === "boolean") {
               if(val) {
                  // you can search for a true boolean by 1 or by the word 'true'
                  if(search != "1" && ("true").indexOf(search) < 0) return false;
               }
               else if(search != "0" && ("false").indexOf(search) < 0) return false;
            }

            else if(typeof val === "number") {
               val = val.toString();
            }
            else if(typeof val === "string") {
               val = val.toLowerCase();
            }

            if(!val) {
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
export const exportTable = (items, columns, name) => {

   const renderColumns = columns.filter(x => x.key != undefined);

   const header = renderColumns.map(column => (
      "  <ss:Cell>\n" +
         "    <ss:Data ss:Type='String'>" +
            column.name +
         "</ss:Data>\n" +
      "  </ss:Cell>\n"
   )).join("");

   const body = items.map(item => (
      "<ss:Row>\n" +
         renderColumns.map(column => {
            const val = getValue(item, column.key);
            return (
               "  <ss:Cell>\n" +
                  `    <ss:Data ss:Type="${ typeof val === "number" ? "Number": "String" }">` +
                     val +
                  "</ss:Data>\n" +
               "  </ss:Cell>\n"
            );
         }).join("") +
      "</ss:Row>\n"
   )).join("");

   const table = (
      `<?xml version="1.0"?>\n` +
      `<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n` +
         `<ss:Worksheet ss:Name="Sheet1">\n` +
            "<ss:Table>\n\n" +
               "<ss:Row>\n" +
                  header +
               "</ss:Row>\n" +
               body +
            "\n</ss:Table>\n" +
         "</ss:Worksheet>\n" +
      "</ss:Workbook>\n"
   );

   const blob = new Blob([table], {
      "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
   });

   // creates a temporary hidden anchor on the page
   let a = document.createElement("a");
   a.style = "display: none";

   // adds the blob to the anchor
   const url = URL.createObjectURL(blob);
   a.href = url;

   // adds the table name to the downloaded file.  If none specified, the name is 'table'
   a.download = name + ".xls";

   // adds the anchor, click it, and removes it
   document.body.appendChild(a);
   a.click();
   a.parentNode.removeChild(a);
   window.URL.revokeObjectURL(url);
};
