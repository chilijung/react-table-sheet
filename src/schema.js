/* eslint-disable */
import React from 'react';

export default {
  nodes: {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>
  },
  marks: {
    bold: props => <strong {...props.attributes}>{props.children}</strong>,
    code: props => <code {...props.attributes}>{props.children}</code>,
    italic: props => <em {...props.attributes}>{props.children}</em>,
    underline: props => <u {...props.attributes}>{props.children}</u>
  }
};

