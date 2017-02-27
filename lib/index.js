'use strict'
module.exports = exports = require('./object')

// numbers
var numbers = require('./numbers')
exports.Byte = numbers.create('UInt8', 1)
exports.Int8 = numbers.create('Int8', 1)
exports.UInt8 = numbers.create('UInt8', 1)
exports.Int16BE = numbers.create('Int16BE', 2)
exports.Int16LE = numbers.create('Int16LE', 2)
exports.UInt16BE = numbers.create('UInt16BE', 2)
exports.UInt16LE = numbers.create('UInt16LE', 2)
exports.Int32BE = numbers.create('Int32BE', 4)
exports.Int32LE = numbers.create('Int32LE', 4)
exports.UInt32BE = numbers.create('UInt32BE', 4)
exports.UInt32LE = numbers.create('UInt32LE', 4)
exports.Int64BE = numbers.create('Int64BE', 8)
exports.Int64LE = numbers.create('Int64LE', 8)
exports.UInt64BE = numbers.create('UInt64BE', 8)
exports.UInt64LE = numbers.create('UInt64LE', 8)
exports.FloatBE = numbers.create('FloatBE', 4)
exports.FloatLE = numbers.create('FloatLE', 4)
exports.DoubleBE = numbers.create('DoubleBE', 8)
exports.DoubleLE = numbers.create('DoubleLE', 8)

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

// value
exports.Value = require('./value')
