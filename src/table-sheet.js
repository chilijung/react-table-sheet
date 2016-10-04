/* eslint-disable max-len */
import React, {Component, PropTypes} from 'react';

import convert, {ALPHABET_ASCII} from 'number-converter-alphabet';
import {DivTable, DivRow, DivCell} from 'react-modular-table';
import {createArray} from './utils/twoDimensionArray';
import {cloneDeep, isString} from 'lodash';
import Radium from 'radium';
import {Editor, Html} from 'slate';
import rules from './rules';
import schema from './schema';
import THEME from './style';
const html = new Html({rules});

@Radium
export default class TableSheet extends Component {
  constructor(props) {
    super(props);

    this.onClickColumn = this.onClickColumn.bind(this);
    this.onMouseOverColumn = this.onMouseOverColumn.bind(this);
    this.onMouseOutColumn = this.onMouseOutColumn.bind(this);
    this.onClickHeaderRow = this.onClickHeaderRow.bind(this);
    this._checkLocalStorage = this._checkLocalStorage.bind(this);
    const rowColumnMatrix = this._checkLocalStorage();

    this.state = {
      activeRow: null,
      activeCell: null,
      selectedRow: null,
      selectedColumn: null,
      selectedHeaderRow: null,
      contentMatrix: rowColumnMatrix
    };
  }

  static defaultProps = {
    width: 500,
    height: 500,
    row: 20,
    column: 10,
    header: true,
    columnHeader: null,
    theme: 'default',
    onMouseOver: arg => arg,
    onMouseOut: arg => arg,
    onClick: arg => arg
  };

  static propTypes = {
    header: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    row: PropTypes.number,
    column: PropTypes.number,
    columnHeader: PropTypes.array,
    theme: PropTypes.string,
    selectedRow: PropTypes.number,
    selectedColumn: PropTypes.number,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onClick: PropTypes.func
  };

  onClickColumn(e, data) {
    const {
      selectedRow,
      selectedColumn
    } = this.state;

    this.props.onClick(e, data);
    if (selectedRow === data.rowNumber && selectedColumn === data.columnNumber) {
      return false;
    }

    let modifyData;
    if (this.props.header) {
      modifyData = {
        rowNumber: data.rowNumber - 1,
        columnNumber: data.columnNumber,
        prevRow: selectedRow - 1,
        prevColumn: selectedColumn
      };
    } else {
      modifyData = {...data, prevRow: selectedRow, prevColumn: selectedColumn};
    }

    this.setState({
      selectedRow: data.rowNumber,
      selectedColumn: data.columnNumber,
      selectedHeaderRow: null,
      contentMatrix: this._checkLocalStorage(modifyData)
    });
  }

  _checkLocalStorage(data) {
    const {
      row,
      column
    } = this.props;

    let rowColumnMatrix;
    try {
      const value = localStorage.getItem('table-sheet-data') || undefined;
      rowColumnMatrix = JSON.parse(value);
      if (data) {
        // selected row and column, deserialize cell
        rowColumnMatrix[data.rowNumber][data.columnNumber] =
          html.deserialize(rowColumnMatrix[data.rowNumber][data.columnNumber]);
        // serialize to html previous cell
        if (data.prevRow && data.prevColumn) {
          const prevData = rowColumnMatrix[data.prevRow][data.prevColumn];

          if (!isString(prevData)) {
            rowColumnMatrix[data.prevRow][data.prevColumn] =
              html.serialize(prevData);
          }
        }
      }
    } catch (e) {
      rowColumnMatrix = createArray(row, column);
      localStorage.setItem('table-sheet-data', JSON.stringify(rowColumnMatrix));
    }
    return rowColumnMatrix;
  }

  onClickHeaderRow(e, data) {
    this.props.onClick(e, data);
    this.setState({
      selectedRow: null,
      selectedColumn: null,
      selectedHeaderRow: data.columnNumber
    });
  }

  onMouseOverColumn(e, data) {
    this.props.onMouseOver(e, data);
    this.setState({
      activeRow: data.rowNumber,
      activeCell: data.columnNumber
    });
  }

  onMouseOutColumn(e) {
    this.props.onMouseOut(e);

    this.setState({
      activeRow: null,
      activeCell: null
    });
  }

  onChange(state, data) {
    let contentMatrix = cloneDeep(this.state.contentMatrix);
    contentMatrix[data.rowNumber][data.columnNumber] = state;
    this.setState({contentMatrix});
  }

  onDocumentChange(document, state, data) {
    let contentMatrix = cloneDeep(this.state.contentMatrix);
    const string = html.serialize(state);
    contentMatrix[data.rowNumber][data.columnNumber] = string;
    localStorage.setItem('table-sheet-data', JSON.stringify(contentMatrix));
  }

  render() {
    const {
      width,
      height,
      row,
      theme,
      column,
      header,
      columnHeader
    } = this.props;

    const {
      activeCell,
      activeRow,
      selectedColumn,
      selectedRow,
      selectedHeaderRow,
      contentMatrix
    } = this.state;

    // theme style
    const containerStyle = THEME[theme].container;
    const tableStyle = THEME[theme].table;
    const cellOuterStyle = THEME[theme].cellOuter;
    const cellStyle = THEME[theme].cell;

    // if show header add an additional row and column for header.
    const rowArr = [].constructor.apply(this, new Array(header ? (row + 1) : row));
    const columnArr = [].constructor.apply(this, new Array(column));

    const cells = rowNumber => {
      if (rowNumber === 0 && header) {
        // if show header and the first row
        const headers = columnHeader || columnArr;

        return headers.map((val, columnNumber) => {
          let cellStyleArr = [];
          let active = false;
          if (rowNumber === activeRow && columnNumber === activeCell) {
            cellStyleArr.push(cellStyle.defaultHeader, cellStyle.mouseOverHeader);
          } else {
            cellStyleArr.push(cellStyle.defaultHeader);
          }

          if (rowNumber === selectedRow && columnNumber === selectedColumn) {
            cellStyleArr.push(cellStyle.selected);
            active = true;
          }

          return (
            <DivCell
              key={columnNumber}
              data-active={active}
              style={cellStyleArr}
              onMouseOut={this.onMouseOutColumn}
              onMouseOver={e =>
                this.onMouseOverColumn(e, {rowNumber, columnNumber})}
              onClick={e =>
                this.onClickHeaderRow(e, {rowNumber, columnNumber})}
            >
              {val ? val : convert(columnNumber, ALPHABET_ASCII).toUpperCase()}
            </DivCell>
          );
        });
      }

      return columnArr.map((val, columnNumber) => {
        let cellStyleArr = [];
        let active = false;
        if (rowNumber === activeRow && columnNumber === activeCell) {
          cellStyleArr.push(cellStyle.default, cellStyle.mouseOver);
        } else if (selectedHeaderRow === columnNumber) {
          cellStyleArr.push(cellStyle.default, cellStyle.mouseOver);
        } else {
          cellStyleArr.push(cellStyle.default);
        }

        if (rowNumber === selectedRow && columnNumber === selectedColumn) {
          cellStyleArr.push(cellStyle.selected);
          active = true;
        }

        return (
          <DivCell
            key={columnNumber}
            data-active={active}
            outerStyle={cellOuterStyle}
            style={cellStyleArr}
            onMouseOut={this.onMouseOutColumn}
            onMouseOver={e =>
              this.onMouseOverColumn(e, {rowNumber, columnNumber})}
            onClick={e =>
              this.onClickColumn(e, {rowNumber, columnNumber})}
          >
            {
              active ?
              <Editor
                schema={schema}
                state={contentMatrix[header ? rowNumber - 1 : rowNumber][columnNumber]}
                onChange={state => this.onChange(state, {rowNumber: header ? rowNumber - 1 : rowNumber, columnNumber})}
                onDocumentChange={(document, state) =>
                  this.onDocumentChange(document, state, {rowNumber: header ? rowNumber - 1 : rowNumber, columnNumber})}
                /> :
              <div dangerouslySetInnerHTML={{
                __html: contentMatrix[header ? rowNumber - 1 : rowNumber][columnNumber]}}
                style={{width: 'inherit'}}/>
            }
          </DivCell>
        );
      });
    };

    return (
      <div style={[containerStyle, {display: 'inline-block'}]}>
        <div style={{position: 'relative'}}>
          <DivTable width={width} height={height} outerStyle={tableStyle}>
            {
              rowArr.map((val, rowNumber) => {
                return (
                  <DivRow key={rowNumber}>
                    {cells(rowNumber)}
                  </DivRow>
                );
              })
            }
          </DivTable>
        </div>
      </div>
    );
  }
}
