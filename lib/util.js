'use strict'
var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

exports.newBuffer = function (blength) {
  if (blength > 0 && blength <= MAX_ALLOC) return new Buffer(blength)
  throw new Error('buffer length should be in interval (0, ' + MAX_ALLOC + ']')
}

exports.createBuffer = function (value, length) {
  var blength = typeof length === 'number' ? length : length(value)
  return exports.newBuffer(blength)
}
