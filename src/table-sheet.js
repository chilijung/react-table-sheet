/* eslint-disable max-len */
import React, {Component, PropTypes} from 'react';

import convert, {ALPHABET_ASCII} from 'number-converter-alphabet';
import {DivTable, DivRow, DivCell} from 'react-modular-table';
import Radium from 'radium';
import {Editor, Raw} from 'slate';
import THEME from './style';

@Radium
export default class TableSheet extends Component {
  constructor(props) {
    super(props);

    this.onClickColumn = this.onClickColumn.bind(this);
    this.onMouseOverColumn = this.onMouseOverColumn.bind(this);
    this.onMouseOutColumn = this.onMouseOutColumn.bind(this);
    this.onClickHeaderRow = this.onClickHeaderRow.bind(this);

    const initialEditorState = Raw.deserialize({
      nodes: [
        {
          kind: 'block',
          type: 'paragraph',
          nodes: [
            {
              kind: 'text',
              text: ''
            }
          ]
        }
      ]
    }, {terse: true});

    this.state = {
      activeRow: null,
      activeCell: null,
      selectedRow: null,
      selectedColumn: null,
      selectedHeaderRow: null,
      editor: initialEditorState
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
    this.props.onClick(e, data);
    this.setState({
      selectedRow: data.rowNumber,
      selectedColumn: data.columnNumber,
      selectedHeaderRow: null
    });
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
      editor
    } = this.state;

    // theme style
    const containerStyle = THEME[theme].container;
    const tableStyle = THEME[theme].table;
    const rowStyle = THEME[theme].row;
    const cellOuterStyle = THEME[theme].cellOuter;
    const cellStyle = THEME[theme].cell;

    // if show header add an additional row and column for header.
    const rowArr = [].constructor.apply(this, new Array(header ? (row + 1) : row));
    const columnArr = [].constructor.apply(this, new Array(header ? (column) : column));

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
                state={editor}
                onChange={state => this.setState({editor: state})}
                /> : null
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
                  <DivRow key={rowNumber} outerStyle={rowStyle}>
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
