import React from 'react';
import ReactDOM from 'react-dom';
import TableSheet from '../src';

ReactDOM.render(
  <TableSheet
    width={800}
    height={500}
    row={10}
    column={5}
    columnHeader={['test1', 'test2', 'test3', 'test4', 'test5']}
  />
, document.getElementById('root'));
