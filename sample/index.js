import React from "react";
import ReactDOM from "react-dom";

import { USERS } from "./USERS";

import Tablo from "../src/index";

import "../src/index.css";

const renderClick = item => (
   <i className="material-icons"
      onClick = {() => alert(`Clicked on ${item.name}`)}
   > edit </i>
);

const columns = [
  { width: 25, component: renderClick },
  { name: "Name", key: "name", searchable: false },
  { name: "Gender", key: "gender", filterable: true },
  { name: "Email", key: "contact.email", sortable: false },
  { name: "Job", key: "job_title" },
];



const App = () => (
	<div id="paper">
		<Tablo
			items={USERS}
			limit={10}
			columns={columns}
			id="code"
		/>
	</div>
);

ReactDOM.render(
  <App />
, document.querySelector("#app"));
