/* eslint-disable max-len */
import React, {Component, PropTypes} from 'react';

import convert, {ALPHABET_ASCII} from 'number-converter-alphabet';
import {DivTable, DivRow, DivCell} from 'react-modular-table';
import {cloneDeep, isString, assign} from 'lodash';
import Radium from 'radium';
import Draggable from 'react-draggable';
import {Editor, Html} from 'slate';
import Toolbar from './toolbar';

import {createArray} from './utils/twoDimensionArray';
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
    this.handleStart = this.handleStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDocumentChange = this.onDocumentChange.bind(this);
    this.editorLength = this.editorLength.bind(this);
    this.headerRowScroll = this.headerRowScroll.bind(this);

    const rowColumnMatrix = this._checkLocalStorage();
    const initialColumnWidth = [].constructor.apply(this, new Array(props.column))
                                  .map((val, i) => props.columnWidth[i] || props.width / props.column);

    this.state = {
      activeRow: null,
      activeCell: null,
      selectedRow: null,
      selectedColumn: null,
      selectedHeaderRow: null,
      headerTop: null,
      headerLeft: null,
      editorTextLength: 0,
      columnWidth: initialColumnWidth,
      contentMatrix: rowColumnMatrix
    };
  }

  static defaultProps = {
    width: 500,
    height: 500,
    row: 20,
    column: 10,
    header: true,
    headerFixed: true,
    resizeColumn: true,
    columnHeader: [],
    columnWidth: [],
    theme: 'default',
    localStorageKey: 'react-table-sheet-data',
    onMouseOver: arg => arg,
    onMouseOut: arg => arg,
    onClick: arg => arg
  };

  static propTypes = {
    header: PropTypes.bool,
    resizeColumn: PropTypes.bool,
    headerFixed: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    row: PropTypes.number,
    column: PropTypes.number,
    columnHeader: PropTypes.array,
    columnWidth: PropTypes.array,
    theme: PropTypes.string,
    localStorageKey: PropTypes.string,
    selectedRow: PropTypes.number,
    selectedColumn: PropTypes.number,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onClick: PropTypes.func
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      selectedRow,
      selectedColumn
    } = this.state;

    if (
      selectedRow !== null && selectedColumn !== null &&
        (prevState.selectedRow !== selectedRow ||
          prevState.selectedColumn !== selectedColumn)) {
      this.editor.focus();

      const editorTextLength = this.editorLength();
      this.setState({editorTextLength});
    }
  }

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
        prevRow: selectedRow ? selectedRow - 1 : selectedRow,
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
      const value = localStorage.getItem(this.props.localStorageKey) || undefined;
      rowColumnMatrix = JSON.parse(value);
      // serialize to html previous cell
      if (data && data.prevRow !== null && data.prevColumn !== null) {
        const prevData = rowColumnMatrix[data.prevRow][data.prevColumn];

        if (!isString(prevData)) {
          rowColumnMatrix[data.prevRow][data.prevColumn] =
            html.serialize(prevData);
        }
      }

      if (data && data.rowNumber !== null && data.columnNumber !== null) {
        // selected row and column, deserialize cell
        rowColumnMatrix[data.rowNumber][data.columnNumber] =
          html.deserialize(rowColumnMatrix[data.rowNumber][data.columnNumber]);
      }
    } catch (e) {
      rowColumnMatrix = createArray(row, column);
      localStorage.setItem(this.props.localStorageKey, JSON.stringify(rowColumnMatrix));
    }
    return rowColumnMatrix;
  }

  onClickHeaderRow(e, data) {
    const {
      selectedRow,
      selectedColumn
    } = this.state;

    this.props.onClick(e, data);
    const newState = {
      selectedRow: null,
      selectedColumn: null,
      selectedHeaderRow: data.columnNumber
    };

    if (selectedRow !== null && selectedColumn !== null) {
      const prevCell = {prevRow: selectedRow, prevColumn: selectedColumn};
      this.setState(
        assign(newState, {
          contentMatrix: this._checkLocalStorage(...prevCell)
        })
      );
    } else {
      this.setState(newState);
    }
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

  editorLength() {
    const editorTextLength = this.editorContainer.children[0]
      .textContent.trim().length;
    return editorTextLength;
  }

  onChange(state, data) {
    let contentMatrix = cloneDeep(this.state.contentMatrix);
    const editorTextLength = this.editorLength();

    if (editorTextLength > 100 &&
      editorTextLength > this.state.editorTextLength) {
      this.setState({
        contentMatrix,
        editorTextLength: editorTextLength - 1
      });
    } else {
      contentMatrix[data.rowNumber][data.columnNumber] = state;
      this.setState({
        contentMatrix,
        editorTextLength
      });
    }
  }

  onDocumentChange(document, state, data) {
    let contentMatrix = cloneDeep(this.state.contentMatrix);
    const string = html.serialize(state);
    contentMatrix[data.rowNumber][data.columnNumber] = string;
    localStorage.setItem(this.props.localStorageKey, JSON.stringify(contentMatrix));
  }

  handleStart(e, data, prevWidth) {
    this.resizeGuide.style.display = 'inline';
    this.resizeGuide.style.left = `${prevWidth - 2}px`;
  }

  handleDrag(e, data, prevWidth) {
    this.resizeGuide.style.display = 'inline';
    this.resizeGuide.style.left = `${prevWidth + data.x - 2}px`;
  }

  handleStop(e, data, columnNumber) {
    const columnWidth = cloneDeep(this.state.columnWidth);
    columnWidth[columnNumber] += data.x;
    columnWidth[columnNumber + 1] -= data.x;
    this.resizeGuide.style.display = 'none';
    this.setState({columnWidth});
  }

  headerRowScroll(node) {
    const that = this;
    if (node && !this.headerScrollListener) {
      this.headerScrollListener = true;
      node.addEventListener('scroll', e => {
        const initialHeaderPosition = e.target.children[1].getBoundingClientRect();
        that.setState({
          headerTop: initialHeaderPosition.top,
          headerLeft: initialHeaderPosition.left
        });
      });

      const headerPosition = node.children[1].getBoundingClientRect();
      this.headerInitialTop = headerPosition.top;
      this.headerInitialLeft = headerPosition.left;
    }
  }

  render() {
    const {
      width,
      height,
      row,
      theme,
      column,
      header,
      columnHeader,
      resizeColumn,
      headerFixed
    } = this.props;

    const {
      activeCell,
      activeRow,
      selectedColumn,
      selectedRow,
      selectedHeaderRow,
      contentMatrix,
      columnWidth,
      editorTextLength
    } = this.state;

    // theme style
    const containerStyle = THEME[theme].container;
    const tableStyle = THEME[theme].table;
    const cellOuterStyle = THEME[theme].cellOuter;
    const cellStyle = THEME[theme].cell;
    const resizeHandlerStyle = THEME[theme].resizeHandler;
    const resizeHandlerGuideStyle = THEME[theme].resizeHandlerGuide;

    // if show header add an additional row and column for header.
    const rowArr = [].constructor.apply(this, new Array(header ? (row + 1) : row));
    const columnArr = [].constructor.apply(this, new Array(column))
                        .map((val, i) => columnHeader[i] || convert(i, ALPHABET_ASCII).toUpperCase());

    const resizeHandlerGuide = (
      <div ref={node => {
        this.resizeGuide = node;
      }} style={[resizeHandlerGuideStyle,
        {
          top: this.state.headerTop && headerFixed ?
            `${this.headerInitialTop - this.state.headerTop}px` : '0px',
          height: '100%',
          border: '1px dashed #CCC'
        }]}/>
    );

    const cells = rowNumber => {
      if (rowNumber === 0 && header) {
        return columnArr.map((val, columnNumber) => {
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

          const prevWidth = columnWidth.slice(0, columnNumber + 1)
                              .reduce((acc, cur) => acc + cur, 0);

          const resizeHandler = (
            <Draggable
              axis="x"
              zIndex={100}
              position={{x: 0, y: 0}}
              bounds={{
                left: -columnWidth[columnNumber] + 50,
                right: columnWidth[columnNumber + 1] - 50
              }}
              onStart={(e, data) => this.handleStart(e, data, prevWidth)}
              onDrag={(e, data) => this.handleDrag(e, data, prevWidth)}
              onStop={(e, data) => this.handleStop(e, data, columnNumber)}>
              <div style={[resizeHandlerStyle,
                {
                  height: '30px',
                  width: '3px',
                  left: prevWidth - 3
                }]}/>
            </Draggable>
          );

          return (
            <DivCell
              cellWidth={columnWidth[columnNumber]}
              key={columnNumber}
              data-active={active}
              outerStyle={cellStyleArr}
              style={{display: 'inline', wordBreak: 'keep-all'}}
              onMouseOut={this.onMouseOutColumn}
              onMouseOver={e =>
                this.onMouseOverColumn(e, {rowNumber, columnNumber})}
              onClick={e =>
                this.onClickHeaderRow(e, {rowNumber, columnNumber})}
            >
              {
                resizeColumn &&
                (columnNumber + 1 !== columnWidth.length) ?
                  resizeHandler : null
              }
              {val}
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
            cellWidth={columnWidth[columnNumber]}
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
              <div ref={node => {
                this.editorContainer = node;
              }}>
                <Editor
                  ref={node => {
                    this.editor = node;
                  }}
                  schema={schema}
                  state={contentMatrix[header ? rowNumber - 1 : rowNumber][columnNumber]}
                  onChange={state => {
                    this.onChange(state, {rowNumber: header ? rowNumber - 1 : rowNumber, columnNumber});
                  }}
                  onDocumentChange={(document, state) => {
                    this.onDocumentChange(document, state, {rowNumber: header ? rowNumber - 1 : rowNumber, columnNumber});
                  }}
                  />
              </div> :
              <div dangerouslySetInnerHTML={{
                __html: contentMatrix[header ? rowNumber - 1 : rowNumber][columnNumber]}}
                style={{width: 'inherit'}}/>
            }
          </DivCell>
        );
      });
    };

    return (
      <div>
        {selectedRow !== null && selectedColumn !== null ?
          <Toolbar
            editorTextLength={editorTextLength}
            state={contentMatrix[header ? selectedRow - 1 : selectedRow][selectedColumn]}
            theme={theme}
            onChange={state => this.onChange(state, {
              rowNumber: header ? selectedRow - 1 : selectedRow,
              columnNumber: selectedColumn
            })}
            onDocumentChange={(document, state) =>
              this.onDocumentChange(
                document,
                state, {
                  rowNumber: header ? selectedRow - 1 : selectedRow,
                  columnNumber: selectedColumn
                }
              )
            }
            /> : null}
        <div
          ref={node => {
            if (headerFixed) {
              this.headerRowScroll(node);
            } else {
              return;
            }
          }}
          style={[containerStyle, {
            display: 'inline-block',
            position: 'relative',
            width: width,
            height: height,
            paddingTop: headerFixed ? '30px' : '0px'
          }]}>
          {resizeColumn ? resizeHandlerGuide : null}
          <DivTable width={width} height={height} outerStyle={tableStyle}>
            {
              rowArr.map((val, rowNumber) => {
                return (
                  <DivRow
                    key={rowNumber}
                    rowHeight={rowNumber === 0 ? 30 : null}
                    outerStyle={rowNumber === 0 && headerFixed ? {
                      position: 'absolute',
                      top: this.state.headerTop ?
                        `${this.headerInitialTop - this.state.headerTop}px` : '0px',
                      left: '0px'
                    } : null}>
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
