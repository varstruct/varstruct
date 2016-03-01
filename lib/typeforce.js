'use strict'

var typeforce = module.exports = require('typeforce')

typeforce.VarStructItem = typeforce.compile({
  encode: 'Function',
  decode: 'Function',
  length: typeforce.oneOf('Number', 'Function')
})

typeforce.VarStructRawItem = typeforce.compile({
  name: 'String',
  type: typeforce.VarStructItem
})

typeforce.createNArray = function (n) {
  return function (array) {
    typeforce(typeforce.Array, array)
    if (array.length === n) return true
    throw new typeforce.TfTypeError('Expected ' + n + '-items Array, got ' + array.length + '-items Array')
  }
}

typeforce.createNBuffer = function (n) {
  return function (buffer) {
    typeforce(typeforce.Buffer, buffer)
    if (buffer.length === n) return true
    throw new typeforce.TfTypeError('Expected ' + n + '-byte Buffer, got ' + buffer.length + '-byte Buffer')
  }
}
