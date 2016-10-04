/* eslint-disable */
import React from 'react';

export default {
  nodes: {
    code: props => <pre {...props.attributes}>{props.children}</pre>,
    paragraph: props => <p {...props.attributes}>{props.children}</p>,
    quote: props => <blockquote {...props.attributes}>{props.children}</blockquote>
  },
  marks: {
    bold: props => <strong>{props.children}</strong>,
    italic: props => <em>{props.children}</em>,
    underline: props => <u>{props.children}</u>,
  }
};

