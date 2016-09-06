import React from "react";
import ReactDOM from "react-dom";

import USERS from "./USERS";

import Tablo from "tablo";

const COLUMNS = [
  { name: "Name", id: "Name" },
  { name: "Email", id: "Email" },
  { name: "Country", id: "Country" }
];

const App = () => (
   <div id="paper">
      <Tablo
         items={USERS}
         limit={10}
         columns={COLUMNS}
         onCreate={() => alert("Create click")}
         onUpdate={item => alert("Update click on " + item.Name)}
         onDelete={item => alert("Delete click on " + item.Name)}
         id="Name"
      />
   </div>
);

ReactDOM.render(
   <App />,
   document.querySelector("#app")
);
