# Tablo
[![npm package](https://img.shields.io/npm/v/tablo.svg?style=flat-square)](https://www.npmjs.org/package/tablo)

Tablo is a [React](http://facebook.github.io/react/) table component. Check it on this playground [here](https://output.jsbin.com/xesotuv).

#### It has the following features
 * filtering by column
 * sorting by column
 * paging
 * optional editing buttons
 * optional selection of rows
 
## Installation

Tablo is available as an [npm package](https://www.npmjs.org/package/tablo).

```sh
npm install tablo
```

### Google Icons

You are required to link the Google Material Icons.  You can link to it somewhere in your html, as in the following example:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
```

# Usage

```jsx
import React from 'react';
import Tablo from 'tablo';

const users = [
  { id: 0, name: "Ivana Burnett", country: "Uzbekistan" }, 
  { id: 1, name: "Iliana Spence", country: "San Marino" }
];

const columns = [
  { id: "name", name: "Name" },
  { id: "country", name: "Country" }
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

## Other Options

| Parameter Name | Data Type | Description |
| --- | --- | --- |
| onCreate | function | |
| onCreate | onCreate | First parameter is the item clicked on |
| onCreate | onCreate | |

