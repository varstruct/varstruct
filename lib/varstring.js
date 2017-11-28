'use strict'
var Buffer = require('safe-buffer').Buffer
var vsVarBuffer = require('./varbuffer')
var util = require('./util')

module.exports = function (lengthType, encoding) {
  if (!util.isAbstractCodec(lengthType)) throw new TypeError('lengthType is invalid codec')

  var bufferCodec = vsVarBuffer(lengthType)
  if (!encoding) encoding = 'utf8'
  if (!Buffer.isEncoding(encoding)) throw new TypeError('invalid encoding')

  function _length (value) {
    if (typeof value !== 'string') throw new TypeError('value must be a string')

    var valueLength = Buffer.byteLength(value, encoding)
    return lengthType.encodingLength(value.length) + valueLength
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (typeof value !== 'string') throw new TypeError('value must be a string')
      if (!offset) offset = 0

      var valueLength = Buffer.byteLength(value, encoding)
      var bytes = lengthType.encodingLength(value.length) + valueLength

      if (!buffer) buffer = Buffer.allocUnsafe(bytes)
      else if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance')
      if (offset + bytes > buffer.length) throw new RangeError('destination buffer is too small')

      lengthType.encode(valueLength, buffer, offset)
      offset += lengthType.encode.bytes
      buffer.write(value, offset, valueLength, encoding)

      encode.bytes = bytes
      return buffer
    },
    decode: function decode (buffer, offset, end) {
      var string = bufferCodec.decode(buffer, offset, end).toString(encoding)

      decode.bytes = bufferCodec.decode.bytes
      return string
    },
    encodingLength: _length
  }
}
