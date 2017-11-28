'use strict'
var Buffer = require('safe-buffer').Buffer
var util = require('./util')

module.exports = function (lengthType, itemType) {
  if (!util.isAbstractCodec(lengthType)) throw new TypeError('lengthType is invalid codec')
  if (!util.isAbstractCodec(itemType)) throw new TypeError('itemType is invalid codec')

  function _length (items) {
    return util.size(items, itemType.encodingLength, lengthType.encodingLength(items.length))
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (!Array.isArray(value)) throw new TypeError('value must be an Array instance')
      if (!buffer) buffer = Buffer.allocUnsafe(_length(value))
      if (!offset) offset = 0
      lengthType.encode(value.length, buffer, offset)
      encode.bytes = util.size(value, function (item, index, loffset) {
        itemType.encode(item, buffer, loffset)
        return itemType.encode.bytes
      }, lengthType.encode.bytes + offset) - offset
      return buffer
    },
    decode: function decode (buffer, offset, end) {
      if (!offset) offset = 0
      var items = new Array(lengthType.decode(buffer, offset, end))
      decode.bytes = util.size(items, function (item, index, loffset) {
        items[index] = itemType.decode(buffer, loffset, end)
        return itemType.decode.bytes
      }, lengthType.decode.bytes + offset) - offset
      return items
    },
    encodingLength: function (value) {
      if (!Array.isArray(value)) throw new TypeError('value must be an Array instance')
      return _length(value)
    }
  }
}
