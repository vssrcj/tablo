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
         trimmed: sortItems(props.items, sort.key, sort.asc)
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

         columns: props.columns.map(column => {
            const extras = column.sortable === true || column.sortabel === undefined ?
               { sortable: true } : { };

            const sortable = column.sortable || column.sortable === undefined;

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

            else if(column.searchable === true || column.searchable === undefined) return {
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

   renderFooter = colSpan => {
      const { trimmed, page, columns } = this.state;
      const { limit, items, name } = this.props;

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

      const exportButton = this.props.noExport ? null :
         <span onClick={() => exportTable(items, columns, name)} className="paging export">Export</span>;

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
         <td className="footer-cell" colSpan={colSpan}>
            <div className="footer-container">
               { paging }
               { exportButton }
               { descriptionGroup }
            </div>
         </td>
      );
   }

   /*
    * sets the complete selections for a column.
    */
   setSelections = (columnId, selections) => {

      const { items } = this.props;

      const columns = this.state.columns.map(column => {
         if(column.key == columnId) {
            return {
               ...column,
               selections
            };
         }
         return column;
      });
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
         let content;
         if(column.header) content = column.header;
         else if(column.component) content = column.name || null;
         else {
            const sortIcon = column.sortable ? (
               <div
                  className={`sort${sort.key === column.key ? " active": ""}`}
                  onClick={() => this.setSort(column.key)}
                  dangerouslySetInnerHTML={{
                     __html: sort.key === column.key ? ( sort.asc ? "&#x21E9;" : "&#x21E7;" ) : "&#x21F3"
                  }}
               />
            ) : null;

            const name = column.name || null;

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

               const search = column.searchable ? (
                  <div className="head-text">
                     <input type="text"
                        onChange={event => this.setSearch(column.key, event.target.value)}
                        className="head-input"
                        placeholder={name}
                        value={column.search}
                     />
                  </div>
               ) : <div className="head-text">{name}</div>;

               content = (
                  <div className="head">
                     { search }
                     { column.sortable && (!column.filterable || column.selections.length !== 1) ? sortIcon : null }
                  </div>
               );
            }
         }

         return (
            <th key={index} style={column.width ? { width: column.width } : {}}>
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
                     if(column.component) return <td key={c}>{column.component(item)}</td>;

                     let value = getValue(item, column.key);
                     if(typeof value == "boolean") value = value ? "True" : "False";
                     return (
                        <td key={column.key}>{value}</td>
                     );
                  })
               }
            </tr>
         );
      })
   );

   render() {

      const { id, limit } = this.props;
      const { columns, sort, trimmed, page } = this.state;

      const items = trimmed.slice(page * limit, (page + 1) * limit);

      return (
         <div className="tablo--container">
            <table className="tablo">
               <thead>
                  <tr>
                     { this.renderColumns(columns, sort) }
                  </tr>
               </thead>
               <tbody>
                  { this.renderBody(items, columns, id) }
                  <tr key={-1}>
                     { this.renderFooter(columns.length) }
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}
