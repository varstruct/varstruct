'use strict'
var VarBuffer = require('./varbuffer')

module.exports = function (lengthType, encoding) {
  var varbuffer = VarBuffer(lengthType)
  if (!encoding) encoding = 'utf8'

  return {
    encode: function encode (value, buffer, offset) {
      if (typeof value !== 'string') throw new TypeError('value must be a string')
      buffer = varbuffer.encode(new Buffer(value, encoding), buffer, offset)
      encode.bytes = varbuffer.encode.bytes
      return buffer
    },
    decode: function decode (buffer, offset) {
      var sbuffer = varbuffer.decode(buffer, offset)
      decode.bytes = varbuffer.decode.bytes
      return sbuffer.toString(encoding)
    },
    encodingLength: function (value) {
      if (typeof value !== 'string') throw new TypeError('value must be a string')
      return varbuffer.encodingLength(new Buffer(value, encoding))
    }
  }
}
