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

  request(url)
    .on('error', error)
    .pipe(concat(function(res) {
      try {
        var body = JSON.parse(res);
      } catch (err) {
        return error(err);
      }
      
      var req = request(body.dist.tarball)
        .on('error', error);
      var parse = tar.Parse()
        .on('error', error);
      var unzip = zlib.createGunzip()
        .on('error', error);
      
      req.pipe(unzip).pipe(parse);
      
      parse.on('entry', function(entry) {
        entry.props.path = entry.props.path.slice(8);
        ee.emit('file', entry);
      });
      
      parse.on('end', function() {
        ee.emit('end');
      });
    }));
  
  return ee;
}