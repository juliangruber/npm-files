var request = require('hyperquest');
var tar = require('tar');
var zlib = require('zlib');
var concat = require('concat-stream');
var EventEmitter = require('events').EventEmitter;

/**
 * Expose `files`.
 */

module.exports = files;

/**
 * Get the published source files of module `name`.
 *
 * @param {String} name
 * @param {Object?} opts
 * @return {EventEmitter}
 */

function files(name, opts) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = fn;
  }
  
  opts = opts || {};
  var version = opts.version || 'latest';
  var registry = opts.registry || 'http://registry.npmjs.org';
  var url = registry + '/' + name + '/' + version;

  var ee = new EventEmitter;
  var error = ee.emit.bind(ee, 'error');

  var req = request(url);
  req.on('error', error);
  req.pipe(concat(function(res) {
    try {
      var body = JSON.parse(res);
    } catch (err) {
      return error(err);
    }
    
    req = request(body.dist.tarball)
      .on('error', error);
    var unzip = zlib.createGunzip()
      .on('error', error);
    
    var parse = new tar.Parse();
    parse.on('error', error);
    parse.on('entry', function(entry) {
      entry.path = entry.path.slice(8);
      ee.emit('file', entry);
    });
    parse.on('end', function() {
      ee.emit('end');
    });

    req.pipe(unzip).pipe(parse);
  }));

  ee.destroy = function() {
    req.destroy();
  };
  
  return ee;
}
