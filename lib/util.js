'use strict'
var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

exports.newBuffer = function (blength) {
  if (blength > 0 && blength <= MAX_ALLOC) return new Buffer(blength)
  throw new RangeError('buffer length should be in interval (0, ' + MAX_ALLOC + ']')
}

// should be faster + work with undefined values
exports.reduce = function (items, iter, acc) {
  for (var i = 0; i < items.length; ++i) acc = iter(acc, items[i], i, items)
  return acc
}
