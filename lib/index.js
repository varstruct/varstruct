'use strict'
module.exports = exports = require('./object')

// numbers
var numbers = require('./numbers')
exports.Byte = numbers.Byte
exports.Int8 = numbers.Int8
exports.UInt8 = numbers.UInt8
exports.Int16BE = numbers.Int16BE
exports.Int16LE = numbers.Int16LE
exports.UInt16BE = numbers.UInt16BE
exports.UInt16LE = numbers.UInt16LE
exports.Int32BE = numbers.Int32BE
exports.Int32LE = numbers.Int32LE
exports.UInt32BE = numbers.UInt32BE
exports.UInt32LE = numbers.UInt32LE
exports.Int64BE = numbers.Int64BE
exports.Int64LE = numbers.Int64LE
exports.UInt64BE = numbers.UInt64BE
exports.UInt64LE = numbers.UInt64LE
exports.FloatBE = numbers.FloatBE
exports.FloatLE = numbers.FloatLE
exports.DoubleBE = numbers.DoubleBE
exports.DoubleLE = numbers.DoubleLE

// array & vararray & sequence
exports.Array = require('./array')
exports.VarArray = require('./vararray')
exports.Sequence = require('./sequence')

// buffer & varbuffer
exports.Buffer = require('./buffer')
exports.VarBuffer = require('./varbuffer')

// string & varstring
exports.String = require('./string')
exports.VarString = require('./varstring')

// bound
exports.Bound = require('./bound')
