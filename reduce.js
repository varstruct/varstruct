'use strict'

// should be faster + work with undefined values
module.exports = function (items, iter, acc) {
  for (var i = 0; i < items.length; ++i) acc = iter(acc, items[i], i, items)
  return acc
}
