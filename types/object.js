'use strict'
var reduce = require('../reduce')

module.exports = function (items) {
  // copy items for freezing
  items = items.map(function (item) {
    if (!item.name) {
      throw new Error('Item missing "name" property')
    }
    if (!item.type ||
    typeof item.type.decode !== 'function' ||
    typeof item.type.encode !== 'function' ||
    typeof item.type.encodingLength !== 'function') {
      throw new Error('Item "' + item.name + '" has invalid codec')
    }
    return { name: item.name, type: item.type }
  })

  function encodingLength (obj) {
    return reduce(items, function (total, item) {
      return total + item.type.encodingLength(obj[item.name])
    }, 0)
  }

  return {
    encode: function encode (obj, buffer, offset) {
      if (!buffer) buffer = new Buffer(encodingLength(obj))
      if (!offset) offset = 0
      encode.bytes = reduce(items, function (loffset, item) {
        item.type.encode(obj[item.name], buffer, loffset)
        return loffset + item.type.encode.bytes
      }, offset) - offset
      return buffer
    },
    decode: function decode (buffer, offset) {
      if (!offset) offset = 0
      var obj = {}
      decode.bytes = reduce(items, function (loffset, item) {
        obj[item.name] = item.type.decode(buffer, loffset)
        return loffset + item.type.decode.bytes
      }, offset) - offset
      return obj
    },
    encodingLength: encodingLength
  }
}
