export default {
  container: {
    backgroundColor: '#FFF',
    padding: '5px'
  },
  table: {
  },
  cellOuter: {
    textAlign: 'left'
  },
  resizeHandler: {
    backgroundColor: '#AAA',
    cursor: 'col-resize',
    position: 'absolute',
    top: '0px'
  },
  // resizeHandlerGuide: {
  //   position: 'absolute',
  //   top: '0px'
  // },
  cell: {
    defaultHeader: {
      backgroundColor: "#EEE",
      textAlign: "center",
      verticalAlign: "middle",
      padding: "3px",
      border: '1px solid #CCC',
      cursor: "pointer"
    },
    mouseOverHeader: {
      border: '1px solid #AAA'
    },
    default: {
      border: '1px solid #CCC'
    },
    active: {
      backgroundColor: '#DEF'
    },
    mouseOver: {
      backgroundColor: '#DEF'
    },
    selected: {
      border: '2px solid #aaa'
    }
  }
};
