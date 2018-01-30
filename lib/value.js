'use strict'
var Buffer = require('safe-buffer').Buffer
var util = require('./util')

module.exports = function (valueType, value) {
  if (!util.isAbstractCodec(valueType)) throw new TypeError('valueType is invalid codec')

  var valueBuffer = valueType.encode(value)
  var encodeLength = valueBuffer.length

  return {
    encode: function encode (valueParam, buffer, offset) {
      if (valueParam !== undefined &&
        valueParam !== value) throw new TypeError('Value parameter must be undefined or equal')

      if (!offset) offset = 0
      if (buffer) {
        if ((buffer.length - offset) < encodeLength) throw new RangeError('destination buffer is too small')
        valueBuffer.copy(buffer, offset)
      } else {
        buffer = Buffer.from(valueBuffer)
      }

      encode.bytes = encodeLength
      return buffer
    },
    decode: function decode (target, offset, end) {
      if (!offset) offset = 0
      if (end === undefined) end = target.length
      if (offset + encodeLength > end) throw new RangeError('not enough data for decode')
//        if (valueBuffer.compare(target, offset, offset + encodeLength) !== 0) throw new TypeError('Expected value ' + value)
      // FIXME: replace with above when Node <5 is deprecated
      for (var i = 0; i < encodeLength; ++i) {
        if (valueBuffer[i] !== target[offset + i]) throw new TypeError('Expected value ' + value)
      }

      decode.bytes = encodeLength
      return value
    },
    encodingLength: function encodingLength (valueParam) {
      if (valueParam !== undefined) throw new TypeError('Value parameter must be undefined')
      return encodeLength
    }
  }
}
