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
  resizeHandlerGuide: {
    position: 'absolute',
    top: '0px',
    display: 'none'
  },
  cell: {
    defaultHeader: {
      backgroundColor: "#EEE",
      textAlign: "center",
      verticalAlign: "middle",
      overflow: "hidden",
      padding: "3px",
      border: '1px solid #CCC',
      cursor: "pointer"
    },
    mouseOverHeader: {
      border: '1px solid #AAA'
    },
    default: {
      border: '1px solid #CCC',
      overflow: 'hidden'
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
  },
  toolbar: {
    icon: {
      fontSize: '18px'
    },
    button: {
      color: '#CCC',
      cursor: 'pointer',
      padding: '10px'
    },
    active: {
      color: 'black'
    },
    menu: {
      padding: '1px 0 17px 18px',
      borderBottom: '2px solid #EEE',
      marginBottom: '20px'
    },
    wordLeft: {
      margin: '10px',
      color: '#CCC'
    }
  }
};
