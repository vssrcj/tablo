import React from "react";
import ReactDOM from "react-dom";

import USERS from "./USERS";

import Tablo from "./tablo";

import "../style/index.css";

const COLUMNS = [
  { name: "Name", key: "Name", searchable: false },
  { name: "Email", key: "Email", sortable: false },
  { name: "Country", key: "Country" },
];

const App = () => (
	<div id="paper">
		<Tablo
			items={USERS}
			limit={10}
			columns={COLUMNS}
			id="Name"
		/>
	</div>
);

ReactDOM.render(
  <App />
, document.querySelector("#app"));
