// createArray(row, column);
//
// [
//   new Array(column),
//   new Array(column),
//   new Array(column),
//   ... rows
// ]
const createArray = (row, column) => {
  const rowArr = [].constructor.apply(this, new Array(row))
    .map(() => '<p></p>');

  return rowArr.map(() => {
    return [].constructor.apply(this, new Array(column))
      .map(() => '<p></p>');
  });
};

export default {createArray};
