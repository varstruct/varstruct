'use strict'
var util = require('../util')

module.exports = function (length, itemType) {
  function encodingLength (items) {
    if (!Array.isArray(items)) throw new TypeError('value must be an Array instance')
    if (items.length !== length) throw new RangeError('value.length is out of bounds')
    return util.reduce(items, function (total, item) {
      return total + itemType.encodingLength(item)
    }, 0)
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (!Array.isArray(value)) throw new TypeError('value must be an Array instance')
      if (value.length !== length) throw new RangeError('value.length is out of bounds')
      if (!buffer) buffer = util.newBuffer(encodingLength(value))
      if (!offset) offset = 0
      encode.bytes = util.reduce(value, function (loffset, item) {
        itemType.encode(item, buffer, loffset)
        return loffset + itemType.encode.bytes
      }, offset) - offset
      return buffer
    },
    decode: function decode (buffer, offset) {
      if (!offset) offset = 0
      var items = new Array(length)
      decode.bytes = util.reduce(items, function (loffset, item, index) {
        items[index] = itemType.decode(buffer, offset + loffset)
        return loffset + itemType.decode.bytes
      }, 0)
      return items
    },
    encodingLength: encodingLength
  }
}
