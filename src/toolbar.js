import React, {Component, PropTypes} from 'react';
import {hasMark, hasBlock} from './utils/has';
import THEME from './style';
import Radium from 'radium';

@Radium
export default class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.renderButton = this.renderButton.bind(this);
    this.renderMarkButton = this.renderMarkButton.bind(this);
    this.renderBlockButton = this.renderBlockButton.bind(this);
    this.onClickMark = this.onClickMark.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
  }

  static propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func,
    onDocumentChange: PropTypes.func,
    theme: PropTypes.string,
    editorTextLength: PropTypes.number
  };

  onClickMark(e, type) {
    e.preventDefault();
    let {state} = this.props;

    const transform = state
      .transform();

    const {document} = state;

    transform
      .toggleMark(type);

    let newState = transform.apply();

    this.props.onDocumentChange(document, newState);
    this.props.onChange(newState);
  }

  renderMarkButton(type, icon) {
    const isActive = hasMark(this.props.state, type);
    const onMouseDown = e => this.onClickMark(e, type);

    return this.renderButton(isActive, onMouseDown, icon);
  }

  onClickBlock(e, type) {
    const DEFAULT_NODE = 'paragraph';

    e.preventDefault();
    let {state} = this.props;
    let transform = state.transform();
    const {document} = state;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = hasBlock(this.props.state, type);
      const isList = hasBlock(this.props.state, 'list-item');

      if (isList) {
        transform = transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        transform = transform
          .setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {
      const isList = hasBlock(this.props.state, 'list-item');
      const isType = state.blocks.some(block => {
        return !!document.getClosest(block, parent => parent.type === type); // eslint-disable-line
      });

      if (isList && isType) {
        transform = transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        transform = transform
          .unwrapBlock(type === 'bulleted-list' ?
            'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      } else {
        transform = transform
          .setBlock('list-item')
          .wrapBlock(type);
      }
    }

    state = transform.apply();
    this.props.onDocumentChange(document, state);
    this.props.onChange(state);
  }

  renderBlockButton(type, icon) {
    const isActive = hasBlock(this.props.state, type);
    const onMouseDown = e => this.onClickBlock(e, type);

    return this.renderButton(isActive, onMouseDown, icon);
  }

  renderButton(isActive, onMouseDown, icon) {
    const toolbarButtonStyle = THEME[this.props.theme].toolbar.button;
    const toolbarButtonActiveStyle = THEME[this.props.theme].toolbar.active;
    const toolbarIconStyle = THEME[this.props.theme].toolbar.icon;

    return (
      <span style={isActive ?
        [toolbarButtonStyle, toolbarButtonActiveStyle] : toolbarButtonStyle}
        onMouseDown={onMouseDown} data-active={isActive}>
        <i className={`fa fa-${icon}`} style={[toolbarIconStyle]}/>
      </span>
    );
  }

  render() {
    const {editorTextLength} = this.props;
    const toolbarMenuStyle = THEME[this.props.theme].toolbar.menu;
    const toolbarMenuWordLeftStyle = THEME[this.props.theme].toolbar.wordLeft;

    const wordLeft = 100 - editorTextLength;
    return (
      <div style={[toolbarMenuStyle]}>
        {this.renderMarkButton('bold', 'bold')}
        {this.renderMarkButton('italic', 'italic')}
        {this.renderMarkButton('underline', 'underline')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'header')}
        {this.renderBlockButton('heading-two', 'header')}
        {this.renderBlockButton('block-quote', 'quote-right')}
        {this.renderBlockButton('numbered-list', 'list-ol')}
        {this.renderBlockButton('bulleted-list', 'list-ul')}
        <div style={[toolbarMenuWordLeftStyle]}>
          Word left:
          {wordLeft < 0 ?
            <span style={{color: 'red'}}>{wordLeft} , too many words.</span> :
            wordLeft
          }
        </div>
      </div>
    );
  }
}
