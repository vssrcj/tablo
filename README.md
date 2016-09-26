# Tablo
[![npm package](https://img.shields.io/npm/v/tablo.svg?style=flat-square)](https://www.npmjs.org/package/tablo)

Tablo is a [React](http://facebook.github.io/react/) table component. Check it on this playground [here](https://output.jsbin.com/xesotuv).

#### It has the following features
 * filtering or searching by column
 * sorting by column
 * paging
 * injecting any components into cells (for making edit buttons, selections etc.)
 
## Installation

Tablo is available as an [npm package](https://www.npmjs.org/package/tablo).

```sh
npm install tablo
```

### Styling

You must reference the **style.css** stylesheet that comes in the tablo directory in some way.  
You can change this file to suit your styling needs, or create your own style under the class name *tablo*.

# Usage

The following is one of the simplest examples you can have

```jsx
import React from 'react';
import Tablo from 'tablo';

const users = [
  { code: 0, name: "Ivana Burnett", country: "Uzbekistan" }, 
  { code: 1, name: "Iliana Spence", country: "San Marino" }
];

const columns = [
  { key: "name", name: "Name" },
  { key: "country", name: "Country" }
];

const Example = () => (
  <Tablo
     items={users}
     limit={10}
     columns={columns}
     id="code"
  />
);

```

#### Table properties

Parameter Name | Description
--- | ---
items | an array of objects that acts as the rows of the table
columns | an array of objects that specify the columns of the table, and how the rows must be displayed
limit | (optional: defaults to 15) the number of entries you want to have displayed per page
key | the key that is unique for each item in items array 
exportName	| (optional) only specify this if you want the table to be exportable. This will then be used as the file name
sort | (optional) specifies the sorted column at render : an object of { **key**, **asc** } where **key** corresponds to the sorted column, and **asc** whether or not it is ascending


#### Column properties

The following properties can be added to the columns property of the table

Parameter Name | Description
--- | ---
key | the key that correspons to the value you want to display of each item in this column. Note that the values in the rows may only be strings or numbers
name | the display name of the column
searchable | if the column is searchable
filterable | if the column is filterable
header | this is a react component to replace the display name of the column <br/>ex:   ```jsx 
const simpleComponent = <div>A complex <em>header</em></div>
```

