'use struct'
var typeforce = require('../typeforce')
var util = require('../util')

module.exports = function (length, itemType) {
  typeforce('Number', length)
  typeforce(typeforce.VarStructItem, itemType)
  var lengthArray = typeforce.createNArray(length)

  function itemsLength (items) {
    if (typeof itemType.length === 'number') return items.length * itemType.length
    return items.reduce(function (total, item) {
      return total + itemType.length(item)
    }, 4)
  }

  return {
    encode: function encode (value, buffer, offset) {
      typeforce(lengthArray, value)
      if (!buffer) buffer = util.newBuffer(4 + itemsLength(value))
      offset |= 0
      if (offset + 4 > buffer.length) throw new Error('destination buffer is too small')
      buffer.writeUInt32BE(value.length, offset)
      encode.bytes = value.reduce(function (loffset, item) {
        itemType.encode(item, buffer, offset + loffset)
        return loffset + itemType.encode.bytes
      }, 4)
      return buffer
    },
    decode: function decode (buffer, offset) {
      offset |= 0
      if (buffer.length < offset + 4) throw new Error('not enough data for decode')
      var items = new Array(buffer.readUInt32BE(offset))
      decode.bytes = items.reduce(function (loffset, item, index) {
        items[index] = itemType.decode(buffer, offset + loffset)
        return loffset + itemType.decode.bytes
      }, 4)
      return items
    },
    length: function (items) {
      typeforce(lengthArray, items)
      return 4 + itemsLength(items)
    }
  }
}
