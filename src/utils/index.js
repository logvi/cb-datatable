const orderBy = (arr, orderBy) => {
  let keys = Object.keys(orderBy);
  if (!keys.length) return arr;
  return arr.sort((a,b) => {
    const ca = a[keys[0]] === 'string' ? a[keys[0]].toLowerCase() : a[keys[0]],
      cb = b[keys[0]] === 'string' ? b[keys[0]].toLowerCase() : b[keys[0]],
      desc = orderBy[keys[0]] === 'desc';
    if (ca > cb) {
      return desc ? -1 : 1;
    }
    if (ca < cb) {
      return desc ? 1 : -1;
    }
  });
};

export {
  orderBy
};
