
# npm-files

Get the published source files of a node module.

## Example

For each file in the [intersect](https://npmjs.org/package/intersect) module, print file meta info and its contents:

```js
var files = require('npm-files');

files('intersect')
  .on('file', function(file) {
    console.log(file.props);
    file.pipe(process.stdout, { end: false });
  })
  .on('end', function() {
    console.log('end');
  })
  .on('error', function(err) {
    throw err;
  });
```

## API

### files(name[, opts])

Create an EventEmitter that emits one `file` event per file in module `name`, and `end` when it's done.

### files#on('file', fn)

Emits a readable stream, with a `props` property that contains useful information such as: 

* `path`
* `size`
* `mtime`
* `cksum`

`file` events are emitted in order and if you start reading a file stream, the next event is only emitted when you're done.

### files#on('end', fn)

All is done.

### files#on('error', fn)

Oops, an error happened. You should listen for this otherwise you node will throw on error. Or use domains.

## Installation

```bash
$ npm install npm-files
```

## License

  MIT
  