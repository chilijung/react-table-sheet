const hasMark = (state, type) => {
  if (state.marks) {
    return state.marks.some(mark => mark.type === type);
  }
};

const hasBlock = (state, type) => {
  if (state.blocks) {
    return state.blocks.some(node => node.type === type);
  }
};

export default {hasMark, hasBlock};
