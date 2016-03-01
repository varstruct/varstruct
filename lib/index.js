'use strict'
var typeforce = require('./typeforce')
var util = require('./util')

module.exports = function (items) {
  typeforce([typeforce.VarStructRawItem], items)

  // copy items for freezing
  items = items.map(function (item) {
    return { name: item.name, type: item.type }
  })

  // compute length
  var length = items.reduce(function (total, item) {
    if (total === null || typeof item.type.length === 'function') return null
    return total + item.type.length
  }, 0)

  // or create compute function
  if (length === null) {
    length = function (obj) {
      return items.reduce(function (total, item) {
        if (typeof item.type.length === 'number') return total + item.type.length
        return total + item.type.length(obj[item.name])
      }, 0)
    }
  }

  return {
    encode: function encode (obj, buffer, offset) {
      typeforce('Object', obj)
      if (!buffer) buffer = util.createBuffer(obj, length)
      encode.bytes = items.reduce(function (offset, item) {
        item.type.encode(obj[item.name], buffer, offset)
        return offset + item.type.encode.bytes
      }, offset | 0)
      return buffer
    },
    decode: function decode (buffer, offset) {
      var obj = {}
      decode.bytes = items.reduce(function (offset, item) {
        obj[item.name] = item.type.decode(buffer, offset)
        return offset + item.type.decode.bytes
      }, offset | 0)
      return obj
    },
    length: length
  }
}

// numbers & varint
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
module.exports.UInt32BE = numbers.UIn32BE
module.exports.UInt32LE = numbers.UIn32LE
module.exports.UInt64BE = numbers.UInt64BE
module.exports.UInt64LE = numbers.UInt64LE
module.exports.FloatBE = numbers.FloatBE
module.exports.FloatLE = numbers.FloatLE
module.exports.DoubleBE = numbers.DoubleBE
module.exports.DoubleLE = numbers.DoubleLE
module.exports.VarUIntBitcoin = require('./types/varuint-bitcoin')
module.exports.VarUIntProtobuf = require('./types/varuint-protobuf')

// buffer & varbuffer
module.exports.Buffer = require('./types/buffer')
module.exports.VarBuffer = require('./types/varbuffer')

// array & vararray
module.exports.Array = require('./types/array')
module.exports.VarArray = require('./types/vararray')

// bound
module.exports.Bound = require('./types/bound')

// typeforce
module.exports.typeforce = typeforce
