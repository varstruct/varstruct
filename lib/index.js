'use strict'
var util = require('./util')

module.exports = function (items) {
  // copy items for freezing
  items = items.map(function (item) {
    return { name: item.name, type: item.type }
  })

  function encodingLength (obj) {
    return util.reduce(items, function (total, item) {
      return total + item.type.encodingLength(obj[item.name])
    }, 0)
  }

  return {
    encode: function encode (obj, buffer, offset) {
      if (!buffer) buffer = util.newBuffer(encodingLength(obj))
      if (!offset) offset = 0
      encode.bytes = util.reduce(items, function (loffset, item) {
        item.type.encode(obj[item.name], buffer, loffset)
        return loffset + item.type.encode.bytes
      }, offset) - offset
      return buffer
    },
    decode: function decode (buffer, offset) {
      if (!offset) offset = 0
      var obj = {}
      decode.bytes = util.reduce(items, function (loffset, item) {
        obj[item.name] = item.type.decode(buffer, loffset)
        return loffset + item.type.decode.bytes
      }, offset) - offset
      return obj
    },
    encodingLength: encodingLength
  }
}

// numbers
var numbers = require('./types/numbers')
module.exports.Byte = numbers.Byte
module.exports.Int8 = numbers.Int8
module.exports.UInt8 = numbers.UInt8
module.exports.Int16BE = numbers.Int16BE
module.exports.Int16LE = numbers.Int16LE
module.exports.UInt16BE = numbers.UInt16BE
module.exports.UInt16LE = numbers.UInt16LE
module.exports.Int32BE = numbers.Int32BE
module.exports.Int32LE = numbers.Int32LE
module.exports.UInt32BE = numbers.UInt32BE
module.exports.UInt32LE = numbers.UInt32LE
module.exports.UInt64BE = numbers.UInt64BE
module.exports.UInt64LE = numbers.UInt64LE
module.exports.FloatBE = numbers.FloatBE
module.exports.FloatLE = numbers.FloatLE
module.exports.DoubleBE = numbers.DoubleBE
module.exports.DoubleLE = numbers.DoubleLE

// array & vararray
module.exports.Array = require('./types/array')
module.exports.VarArray = require('./types/vararray')

// buffer & varbuffer
module.exports.Buffer = require('./types/buffer')
module.exports.VarBuffer = require('./types/varbuffer')

// varstring
module.exports.VarString = require('./types/varstring')

// bound
module.exports.Bound = require('./types/bound')
