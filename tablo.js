import React from "react";

const TABLE_TYPE = {
   SIMPLE: 0,
   EDIT: 1,
   SELECT: 2
};

export default class Tablo extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         sort: props.sort ? props.sort : {
            id: null,
            asc: true
         },
         type: props.onSelect ? TABLE_TYPE.SELECT : ( props.onCreate ? TABLE_TYPE.EDIT : TABLE_TYPE.SIMPLE ),
         items: props.items,
         filtered: props.sort ? this.sortTable(props.sort.id, props.sort.asc, props.items) : props.items,
         page: 1,
         columns: props.columns.map(column => ({ ...column, search: "" }))
      }
   }

   setSort = id => {
      const { sort, filtered } = this.state;

      const asc = sort.id === id ? !sort.asc : true;

      const sorted = this.sortTable(id, asc, filtered);

      this.setState({ sort: { id, asc }, filtered: sorted });
   };

   filterTable = (items, columns) => {

      const searchAbles = columns.filter(c => c.search !== "");
      return items.filter(item => {
         for(var i in searchAbles) {
            let { id, search } = searchAbles[i];
            let val = item[id];
            search = search.toLowerCase();

            if (typeof val === "string") {
               val = val.toLowerCase();
               if (val.indexOf(search) < 0) return false;
            }
            else if (typeof val === "boolean") {
               if(val) {
                  if(search != "1" && ("true").indexOf(search) < 0) return false;
               }
               else {
                  if(search != "0" && ("false").indexOf(search) < 0) return false;
               }
            }
            else if (typeof val === "number") {
               var check = parseFloat(search);
               if(isNaN(check)) return false;
               if(check !== val) return false;
            }
            else return false;
         }
         return true;
      });
   };

   sortTable = (id, asc, filtered) => {

      const L = asc ? -1 : 1;
      const R = asc ? 1 : -1;
      return filtered.sort((a, b) => {
         let A = a[id];
         if(typeof A === "string") A = A.toUpperCase();
         let B = b[id];
         if(typeof B === "string") B = B.toUpperCase();
         if(A < B) return L;
         if(A > B) return R;
         else return 0;
      });
   };

   setSearch = (id, search) => {

      const { items, columns } = this.state;

      const newColumns = columns.map(x => x.id === id ? { ...x, search } : x);

      const filtered = this.filterTable(items, newColumns);

      this.setState({ columns: newColumns, page: 1, filtered });
   };

   componentWillReceiveProps(nextProps) {
      const { sort: { id, asc }, columns } = this.state;
      const { items } = nextProps;

      let filtered = this.filterTable(items, columns);

      if(id !== null) filtered = this.sortTable(id, asc, filtered);

      this.setState({ filtered, items });
   }

   renderFooter = colSpan => {
      const { items, filtered, page } = this.state;
      const { limit } = this.props;

      const pages = parseInt((filtered.length - 1)/limit) + 1;

      const itemsCount = items.length;
      const filteredCount = filtered.length;

      let first = (page - 1) * limit + 1;
      const lastCalc = page * limit;
      const last = filteredCount < lastCalc ? filteredCount : lastCalc;

      const showLast = itemsCount === filteredCount ? "" : `  (filtered from ${itemsCount} entries)`;
      const showMiddle = filteredCount < limit ? "" : `to ${last} `;

      if(filteredCount === 0) first = 0;

      const description = (
         <span className="entries-display">
            {`Showing ${first} ${showMiddle}of ${filteredCount} entries${showLast}`}
         </span>
      );

      if(pages === 1) return (
         <td className="footer-cell" colSpan={colSpan}>
            { description }
         </td>
      );

      let firstDots = false;
      let secondDots = false;

      let p = [];
      for(let i =0; i< pages; i++) {
        p.push(i);
      }
      const paging = p.map(item => {
         if(item + 1 === page)
            return <span key={item} className="paging selected">{item}</span>;

         else if(item === 0 || item === page || item + 2 === page)
            return <span key={item} className="paging" onClick={() => this.setPage(item + 1)}>{item}</span>;

         else if((item < page) && !firstDots) {
            firstDots = true;
            return <span key={item}>...</span>;
         }

         else if((item > page) && !secondDots) {
            secondDots = true;
            return <span key={item}>...</span>;
         }

         else return null;
      })

      return (
         <td className="footer-cell" colSpan={colSpan}>
            <div className="footer-container">
               { paging }
               { description }
            </div>
         </td>
      );
   };

   setPage = page => this.setState({ page });

   renderFirstHeader = type => {
      switch (type) {
         case TABLE_TYPE.SIMPLE:
            return null;
         case TABLE_TYPE.EDIT:
            return (
               <th className="add">
                  <i className="material-icons" onClick={() => this.props.onCreate()}>add</i>
               </th>
            );
         case TABLE_TYPE.SELECT:
            return (
               <th className="select">
               </th>
            );
      }
   };

   renderColumns = (columns, sort) => {
      return columns.map(column => (
         <th key={column.id}>
            <div className="head">
               <div className="head-text"> {
                  column.format === undefined ? (
                     <input type="text"
                     onChange={(event) => this.setSearch(column.id, event.target.value)}
                     className="head-input"
                     placeholder={column.name}
                     value={column.search}
                     />
                  ) : (
                     <span>{column.name}</span>
                  )
               }
               </div>
               <i className="material-icons sort" onClick={() => this.setSort(column.id)}> {
                  sort.id === column.id ? (
                     sort.asc ? "vertical_align_bottom" : "vertical_align_top"
                  ) : "vertical_align_center"
               }
               </i>
            </div>
         </th>
      ));
   };

   renderFirstColumn = item => {
      const { type } = this.state;
      const { selected, id } = this.props;
      switch (type) {
         case TABLE_TYPE.SIMPLE:
            return null;
         case TABLE_TYPE.EDIT:
            return (
               <td key={0} className="first-col">
                  <i className="material-icons edit" onClick={() => this.props.onUpdate(item)}>edit</i>
                  <i className="material-icons close" onClick={() => this.props.onDelete(item)}>close</i>
               </td>
            );
         case TABLE_TYPE.SELECT:
            const currentId = item[id];
            const selectedId = selected ? selected[id] : null;
            return (
               <td key={0} className="first-col"> {
                  currentId === selectedId ? (
                     <i className="material-icons" onCheck={() => {
                         this.props.onSelect(null);
                     }}>check_box</i>
                  ) : (
                     <i className="material-icons" onCheck={() => {
                         this.props.onSelect(item);
                     }}>check_box_outline_blank</i>
                  )
               }
               </td>
            );
      }
   };

   renderBody = (items, columns, id) => {
      return items.map((item, index) => (
         <tr key={id ? item[id] : index}>
            { this.renderFirstColumn(item) }
            { columns.map(column => {
               let value = item[column.id];
               if(typeof valuue == "boolean") value = value ? "True" : "False";
               return (
                  <td key={column.id}>{value}</td>
               );
            })}
         </tr>
      ));
   };

   render() {

      const { id, limit, onCreate, onSelect, onUpdate, onDelete, noPaper } = this.props;
      const { columns, sort, filtered, page, type } = this.state;
      const items = filtered.slice((page - 1) * limit, page * limit);

      return (
         <div className="tablo--container">
            <table className="tablo">
               <thead>
                  <tr>
                     { this.renderFirstHeader(type) }
                     { this.renderColumns(columns, sort) }
                  </tr>
               </thead>
               <tbody>
                  { this.renderBody(items, columns, id) }
                  <tr key={0}>
                     { this.renderFooter(columns.length + (TABLE_TYPE === TABLE_TYPE.SIMPLE ? 0 : 1)) }
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}
