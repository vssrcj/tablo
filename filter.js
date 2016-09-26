/*eslint-disable no-unused-vars*/
import React, { Component } from "react";
/*eslint-enable no-unused-vars*/
import ReactDOM from "react-dom";

export default class Filter extends Component {

   constructor(props) {
      super(props);
      this.state = {
         display: false,
         handler: null
      };
   }

   addToSelections = item => {
      const selections = [ ...this.props.selections, item ];
      this.props.setSelections(selections);
   };

   removeFromSelections = item => {
      const selections = this.props.selections.filter(selection => selection != item);
      this.props.setSelections(selections);
   };

   componentDidMount () {
      const handler = document.body.addEventListener("click", this.handleDocumentClick);
      this.setState({ handler });
   }

   componentWillUnmount () {
      document.body.removeEventListener("click", this.state.handler);
   }

   handleDocumentClick = evt => {
      const selections = ReactDOM.findDOMNode(this.refs.selections);
      if (selections && !selections.contains(evt.target)) {
         this.setState({ display: false });
      }
   };

   clearSelections = () => {
      this.setState({ selections: [] });
      this.props.setSelections([]);
   };

   render() {
      const { display } = this.state;

      const { selections, name, sortIcon } = this.props;

      const selectionsLength = selections.length;

      if(!display) {
         return (
            <div className="head">
               <div className="head-text" onClick={() => this.setState({ display: true })}>
                  <input
                     type="text"
                     className="head-input"
                     placeholder={
                        selectionsLength === 0 ?
                        `${name} (no filters)` :
                        `${name} (${selectionsLength} filters)`
                     }
                     disabled={true}
                  />
               </div>
               {sortIcon}
            </div>
         );
      }

      const filters = this.props.filters.filter(f => selections.indexOf(f) === -1);

      return (
         <div style={{ minWidth: "170px", position: "relative" }}>
            <div className="selections" ref="selections">
               { selectionsLength > 0 ? <div className="clear" onClick={() => this.clearSelections()}>Clear all filters</div> : null }
               <div className="filters">
                  {
                     selections.map(s => (
                        <div className="selection" key={s} onClick={() => this.removeFromSelections(s)}>{s}</div>
                     ))
                  }
               </div>
               <div className="choices">
                  {
                     filters.map(f => (
                        <div className="selection" key={f} onClick={() => this.addToSelections(f)}>{f}</div>
                     ))
                  }
               </div>
            </div>
         </div>
      );
   }
}
