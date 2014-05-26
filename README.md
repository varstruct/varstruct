# varstruct

encode/decode variable binary structures.

This module makes creating binary formats easy.
It supports both fixed length structures (like classic c structs),
and variable (usually length delemited) structures.


## Example - a 3d vector

``` js
var vstruct = require('varstruct')

//create a vector codec.
var vector = vstruct({
  x: vstruct.DoubleBE,
  y: vstruct.DoubleBE,
  z: vstruct.DoubleBE
})

//encode a object to get a buffer
var buffer = vector.encode({
  x: 93.1, y: 87.3, z: 10.39
})

var v = vector.decode(buffer)
```

## Example - a message metadata + attachments

``` js
var vstruct = require('varstruct')

//codec for a sha256 hash
var sha256 = vstruct.buffer(32)

var message = vstruct({
  //the hash of the previous message
  previous: sha256,

  //the hash of the author's public key
  author: sha256,

  //an arbitary length buffer
  message: vstruct.varbuffer(vstruct.varint),

  //hashes of related documents.
  attachments:
    vstruct.vararray(vstruct.byte, sha256)
}

```

## API

### abstract interface: codec.

every thing in varstruct implements a `codec` interface,
#### codec.encode(value, buffer?, offset?)

Encode `value` as binary. If `buffer` is not provided,
return a new buffer. If `buffer` is provided, write the encoding
of `value` into `buffer` starting at `offset`.

If `value` is the wrong type to be encoded, or there is not enough room
left in `buffer` after `offset` then throw an error.

#### codec.decode(buffer, offset=0)

decode the `value` encoded in `buffer` starting at `offset`.
`offset` defaults to `0` if not provided.
Return the new decoded value.

`decode` *must* throw an error if `buffer` is not long enough
to contain a valid value after `offset`.

#### optional integer: codec.length

if this codec always encodes the same length,
set an integer property `length`
If `length` is not provided, `codec.dynamicLength` *must* be.

#### optional: codec.encodingLength(value)

return the number of bytes it would take to encode `value`.
If `encodingLength` is not provided, `codec.length` *must* be.

### Int8, UInt16, UInt16, Int16, UInt32, Int32, UInt64, Int64, Float, Double

number codecs, by default Big Endian.
If you want Little Endian, append `LE`, for examlpe `Int16LE`
Use of Big Endian is encouraged. You can also append `BE` to be
more explicitly Big Endian.

64 bit ints are actually only 53 bit ints, but they will still be
written to 8 bytes. taken from [int53](https://github.com/dannycoates/int53)

### bound(numberCodec, min, max)

return a codec that errors if the value is not within a range.

### varint

variable sized integers, this is just reexporting
[chrisdickinson/varint](https://github.com/chrisdickinson/varint)


### varstruct({name: codec})

create a codec with a fixed number of fields.
If any subcodec has a variable length, then the new codec will as well.

### buffer(length)

create a *fixed* length buffer codec.

### varbuf(lengthCodec)

create a variable length buffer codec. This will first write out the length of the
value buffer and then the value buffer itself. The `lengthCodec` may be
variable length itself (i.e. a varint), but must encode an integer.

### vararray(lengthCodec, itemCodec)

create a variable length codec that encodes an array of items.
`itemCodec` may be any varstruct compatible codec, including a vararray.
As long as it can encode very element in the array.
`lengthCodec` must encode an integer.

## License

MIT
