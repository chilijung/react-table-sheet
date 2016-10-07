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
        <div className="container">
          <h1>Table Sheet</h1>
          <p>
            <button onClick={this.clear}>Clear localStorage</button>
          </p>
          <TableSheet
            width={1200}
            height={600}
            row={10}
            column={5}
            headerFixed={false}
            columnHeader={['test1', 'test2', 'test3', 'test4', 'test5']}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <DemoSheet/>
, document.getElementById('root'));
