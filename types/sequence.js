'use strict'
var reduce = require('../reduce')

module.exports = function (types) {
  // copy items for freezing
  types = types.map(function (itemType) { return itemType })

  function encodingLength (items) {
    if (!Array.isArray(items)) throw new TypeError('value must be an Array instance')
    if (items.length !== types.length) throw new RangeError('value.length is out of bounds')
    return reduce(types, function (total, itemType, index) {
      return total + itemType.encodingLength(items[index])
    }, 0)
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (!Array.isArray(value)) throw new TypeError('value must be an Array instance')
      if (value.length !== types.length) throw new RangeError('value.length is out of bounds')
      if (!buffer) buffer = new Buffer(encodingLength(value))
      if (!offset) offset = 0
      encode.bytes = reduce(types, function (loffset, itemType, index) {
        itemType.encode(value[index], buffer, loffset)
        return loffset + itemType.encode.bytes
      }, offset) - offset
      return buffer
    },
    decode: function decode (buffer, offset) {
      if (!offset) offset = 0
      var items = new Array(types.length)
      decode.bytes = reduce(types, function (loffset, itemType, index) {
        items[index] = itemType.decode(buffer, loffset)
        return loffset + itemType.decode.bytes
      }, offset) - offset
      return items
    },
    encodingLength: encodingLength
  }
}
