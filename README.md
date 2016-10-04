# react-table-sheet [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A simple spreadsheet in table

## Installation

```sh
$ npm install --save react-table-sheet
```

## Usage

```js
var reactTableSheet = require('react-table-sheet');

ReactDOM.render(
	<TableSheet
	  width={800}
	  height={500}
	  row={10}
	  column={5}
	  columnHeader={['header 1', 'header 2', 'header 3', 'header 4', 'header 5']}
	/>
, document.getElementById('root'));
```

## Start example server

```
node devServer.js
```

## Maintainer

[chilijung](https://github.com/chilijung)

## License

MIT © [Canner](https://github.com/Canner)


[npm-image]: https://badge.fury.io/js/react-table-sheet.svg
[npm-url]: https://npmjs.org/package/react-table-sheet
[travis-image]: https://travis-ci.org/Canner/react-table-sheet.svg?branch=master
[travis-url]: https://travis-ci.org/Canner/react-table-sheet
[daviddm-image]: https://david-dm.org/Canner/react-table-sheet.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Canner/react-table-sheet
