'use struct'
var typeforce = require('../typeforce')

module.exports = function (length) {
  typeforce('Number', length)
  var lengthBuffer = typeforce.createNBuffer(length)

  function encode (value, buffer, offset) {
    typeforce(lengthBuffer, value)
    if (!buffer) return new Buffer(value)
    offset |= 0
    if (offset + length > buffer.length) throw new Error('destination buffer is too small')
    value.copy(buffer, offset, 0, length)
    return buffer
  }

  function decode (buffer, offset) {
    offset |= 0
    if (buffer.length < offset + length) throw new Error('not enough data for decode')
    return new Buffer(buffer.slice(offset, offset + length))
  }

  encode.bytes = decode.bytes = length
  return { encode: encode, decode: decode, length: length }
}
