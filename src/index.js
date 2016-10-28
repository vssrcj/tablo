/*eslint-disable no-unused-vars*/
import React, { Component } from "react";

import Filter from "./filter";
/*eslint-enable no-unused-vars*/

import { sortItems, filterItems, getValue, exportTable } from "./utils";

export default class Tablo extends Component {

   constructor(props) {
      super(props);

      const { sort, trimmed } = props.sort ?
      {
         sort: props.sort,
         trimmed: sortItems(props.items, props.sort.key, props.sort.asc)
      } :
      {
         sort: { key: null, asc: true },
         trimmed: props.items
      };

      this.state = {
         // id - the id of the sorted column
         // asc - if values in the column is ascending
         sort,

         // the filtered and sorted items
         trimmed,

         // index of current page
         page: 0,

         limit: props.limit || 15,

         columns: props.columns.map(column => {
            const extras = column.sortable === true || column.sortable === undefined ?
               { sortable: true } : { };

            const sortable = column.key && (column.sortable || column.sortable === undefined);

            if(column.filterable) {
               const filters = [ ... new Set(props.items.map(i => i[column.key])) ];
               return {
                  ...column,
                  ...extras,
                  selections: [],
                  filters,
                  sortable
               };
            }

            else if(!(column.header || column.component) && (column.searchable === true || column.searchable === undefined)) return {
               ...column,
               ...extras,
               search: "",
               searchable: true,
               sortable
            };

            return {
               ...column,
               ...extras,
               sortable
            };
         })
      };
   }

   /*
    * Sets the current sorted column, and sort the trimmed items
    */
   setSort = key => {
      const { sort, trimmed } = this.state;

      const asc = sort.key === key ? !sort.asc : true;

      const sorted = sortItems(trimmed, key, asc);

      this.setState({ sort: { key, asc }, trimmed: sorted });
   };

   /*
    * Sets the search term of a column, and then filter and sort the all items
    */
   setSearch = (key, search) => {

      const { columns, sort } = this.state;

      const { items } = this.props;

      // adds search to the column corresponding to the key paramater
      const newColumns = columns.map(x => x.key === key ? { ...x, search } : x);

      let trimmed = filterItems(items, newColumns);

      if(sort.key !== null) trimmed = sortItems(trimmed, sort.key, sort.asc);

      this.setState({ columns: newColumns, page: 0, trimmed });
   };

   /*
    * When new items are passed as props, filter and sort them, and
    * add them to the state.
    */
   componentWillReceiveProps(nextProps) {

      const { sort: { key, asc }, columns } = this.state;

      const { items } = nextProps;

      let trimmed = filterItems(items, columns);

      if(key !== null) trimmed = sortItems(trimmed, key, asc);

      this.setState({ trimmed });
   }

   renderPaging = () => {
      const { trimmed, page, columns, limit } = this.state;
      const { items, name } = this.props;

      const pages = parseInt((trimmed.length - 1)/limit) + 1;

      const itemsCount = items.length;
      const filteredCount = trimmed.length;

      // description shows the paging information
      let description;

      if(itemsCount <= limit) {
         if(itemsCount != filteredCount) {
            description = `Showing ${filteredCount} entries (filtered from ${itemsCount} entries)`;
         }
         else {
            description = `Showing ${itemsCount} entries`;
         }
      }
      else {
         const first = page * limit + 1;
         const lastLimit = (page + 1) * limit;
         const last = filteredCount < lastLimit ? filteredCount : lastLimit;
         if(itemsCount != filteredCount) {
            description = `Showing ${first} to ${last} of ${filteredCount} entries (filtered from ${itemsCount} entries)`;
         }
         else {
            description = `Showing ${first} to ${last} of ${itemsCount} entries`;
         }
      }

      const descriptionGroup =
         <span className="entries-display">
            {description}
         </span>;


      let paging = null;

      if(pages > 1) {

         let firstDots = false;
         let secondDots = false;

         let pageArray = [];
         for(let i=0; i < pages; i++) {
            pageArray.push(i);
         }

         paging = pageArray.map(i => {
            if(i === page)
               return <span key={i} className="paging selected">{i + 1}</span>;

            else if(i === 0 || i === page-1 || i === page+1)
               return <span key={i} className="paging" onClick={() => this.setPage(i)}>{i + 1}</span>;

            else if((i < page) && !firstDots) {
               firstDots = true;
               return <span className="dots" key={i}>...</span>;
            }

            else if((i > page) && !secondDots) {
               secondDots = true;
               return <span className="dots" key={i}>...</span>;
            }

            else return null;
         });
      }

      return (
         <tfoot>
            <tr>
               <td className="footer-cell" colSpan={columns.length}>
                  <div className="footer-container">
                     { paging }
                     { descriptionGroup }
                  </div>
               </td>
            </tr>
         </tfoot>

      );
   };

   renderExportButton = items => {
      const { name } = this.props;
      return name && items.length > 0 ?
         <button onClick={() => {
            const result = confirm("Are you sure you want to export this table to an Excel spreadsheet?");
            if(result) exportTable(items, this.state.columns, name);
         }} className="export">Export</button> :
         null;
   };

   renderLimitSetter = items => {
      const itemsCount = items.length;
      return (
         this.props.setLimit ?
            <div className="limit-setter">
               <input type="number" min={1} max={itemsCount < 50 ? itemsCount : 50} value={this.state.limit} onChange={this.setLimit} />
            </div> : null
      );
   };

   setLimit = evnt => {
      this.setState({ limit: evnt.target.value, page: 0 });
   };

   renderHeader = () => {

      const { items } = this.props;

      const limitSetter = this.renderLimitSetter(items);
      const exportButton = this.renderExportButton(items);

      if(limitSetter || exportButton) return (
         <div className="header">
            { limitSetter }
            { exportButton }
         </div>
      );

      return null;
   };

   /*
    * sets the complete selections for a column.
    */
   setSelections = (columnId, selections) => {

      const { items } = this.props;

      const columns = this.state.columns.map(c => c.key == columnId ? { ...c, selections } : c );

      const trimmed = filterItems(items, columns);

      this.setState({ columns, trimmed, page: 0 });
   }

   /*
    * as clear as it comes
    */
   setPage = page => this.setState({ page });

   renderColumns = (columns, sort) => (
      columns.map((column, index) => {

         // content will be added directly under a th tag

         const name = column.name || null;

         const sortIcon = column.sortable ? (
            <div
               className={`sort${sort.key === column.key ? " active": ""}`}
               onClick={() => this.setSort(column.key)}
               dangerouslySetInnerHTML={{
                  __html: sort.key === column.key ? ( sort.asc ? "&#x25B4;" : "&#x25Be;" ) : "&#x25B4;"
               }}
            />
         ) : null;

         let content;

         if(column.filterable) {
            const { filters, selections } = column;
            content = (
               <Filter
                  sortIcon={selections.length == 1 ? null : sortIcon}
                  filters={filters}
                  selections={selections}
                  setSelections={selections => this.setSelections(column.key, selections)}
                  name={name}
               />
            );
         }

         else {
            let search;
            if(column.searchable) {
               search = (
                  <div className="head-text">
                     <input type="text"
                        onChange={event => this.setSearch(column.key, event.target.value)}
                        className="head-input"
                        placeholder={name}
                        value={column.search}
                     />
                  </div>
               );
            }
            else if(column.header) {
               search = column.header;
            }
            else {
               search = <div className="head-text">{name}</div>;
            }

            content = (
               <div className="head">
                  { search }
                  { column.sortable && (!column.filterable || column.selections.length !== 1) ? sortIcon : null }
               </div>
            );
         }

         return (
            <th key={index} className={column.className} style={column.width ? { width: column.width } : {}}>
               { content }
            </th>
         );
      })
   );

   renderBody = (items, columns, key) => (
      items.map((item, index) => {
         return (
            <tr key={key ? getValue(item, key) : index}>
               {
                  columns.map((column, c) => {
                     if(column.component) return <td key={c} className={column.className}>{column.component(item)}</td>;

                     let value = getValue(item, column.key);
                     if(typeof value == "boolean") value = value ? "True" : "False";
                     return (
                        <td key={column.key} className={column.className}>{value}</td>
                     );
                  })
               }
            </tr>
         );
      })
   );

   renderFooter = columns => {
      const { items } = this.props;
      if(columns && columns.some(c => c.sum != null)) {
         return (
            <tr key={-1} className="tablo--aggregates">
               {columns.map((c, i) => {
                  if(c.sum != null && items && items.length > 0) {
                     const total = (items.map(i => parseFloat(i[c.key]) || 0)).reduce((a,b) => a+b);
                     let content;
                     if(c.footer) content = c.footer(total);
                     else content = total.toFixed(c.sum);
                     return <td key={i} className="aggregate-cell">{content}</td>
                  }
                  else return <td key={i}></td>
               })}
            </tr>
         );
      }
      return null;
   };

   render() {

      const { id } = this.props;
      const { columns, sort, trimmed, page, limit } = this.state;

      const items = trimmed.slice(page * limit, (page + 1) * limit);

      return (
         <div className="tablo--container">
            { this.renderHeader() }
            <table className="tablo">
               <thead>
                  <tr>
                     { this.renderColumns(columns, sort) }
                  </tr>
               </thead>
               <tbody>
                  { this.renderBody(items, columns, id) }

                  { this.renderFooter(columns) }
               </tbody>
               { this.renderPaging() }
            </table>
         </div>
      );
   }
}
