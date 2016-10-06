import React from 'react';

const BLOCK_TAGS = {
  blockquote: 'block-quote',
  p: 'paragraph',
  pre: 'code',
  ul: 'bulleted-list',
  h1: 'heading-one',
  h2: 'heading-two',
  li: 'list-item',
  ol: 'numbered-list'
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  code: 'code',
  u: 'underline'
};

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName];
      if (!type) {
        return;
      }

      return {
        kind: 'block',
        type: type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') {
        return;
      }
      switch (object.type) {
        case 'code':
          return <pre><code>{children}</code></pre>;
        case 'paragraph':
          return <p>{children}</p>;
        case 'block-quote':
          return <blockquote>{children}</blockquote>;
        case 'bulleted-list':
          return <ul>{children}</ul>;
        case 'heading-one':
          return <h1>{children}</h1>;
        case 'heading-two':
          return <h2>{children}</h2>;
        case 'list-item':
          return <li>{children}</li>;
        case 'numbered-list':
          return <ol>{children}</ol>;
        default:
          return children;
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName];
      if (!type) {
        return;
      }
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind !== 'mark') {
        return;
      }
      switch (object.type) {
        case 'bold':
          return <strong>{children}</strong>;
        case 'italic':
          return <em>{children}</em>;
        case 'underline':
          return <u>{children}</u>;
        case 'code':
          return <code>{children}</code>;
        default:
          return children;
      }
    }
  }
];

export default rules;
