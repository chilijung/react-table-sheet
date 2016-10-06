import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TableSheet from '../src';

class DemoSheet extends Component {

  clear() {
    localStorage.setItem('react-table-sheet-data', undefined);
  }

  render() {
    return (
      <div>
        <h1>Table Sheet</h1>
        <p>
          <button onClick={this.clear}>Clear localStorage</button>
        </p>
        <TableSheet
          width={1200}
          height={1000}
          row={10}
          column={5}
          columnHeader={['test1', 'test2', 'test3', 'test4', 'test5']}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <DemoSheet/>
, document.getElementById('root'));
