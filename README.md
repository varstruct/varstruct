# jstruct


``` js
var hash = new StructType.Buffer(32)

var message = new Struct({
prev   : hash,
author : hash,
message: new StructType.Variable('uint'),

struct({
  prev    : buffer(32),
  author  : buffer(32),
  type    : buffer(32),
  message : variable(uint, buffer)
})


```

## License

MIT
