var test = require('tap').test;
var files = require('..');
var concat = require('concat-stream');

test('files', function(t) {
  t.plan(4);
  var i = 0;
  files('npm-files-test')
    .on('file', function(file) {
      if (i == 0) {
        t.deepEqual(file.props, {
          path: 'package/package.json',
          mode: 420,
          uid: 501,
          gid: 20,
          size: 221,
          mtime: new Date('Sun Dec 22 2013 14:55:52 GMT+0100 (CET)'),
          cksum: 5658,
          type: '0',
          linkpath: '',
          ustar: 'ustar\u0000',
          ustarver: '00',
          uname: '',
          gname: '',
          devmaj: 0,
          devmin: 0,
          fill: ''
        });
      } else {
        t.deepEqual(file.props, {
          path: 'package/index.js',
          mode: 420,
          uid: 501,
          gid: 20,
          size: 6,
          mtime: new Date('Sun Dec 22 2013 14:55:38 GMT+0100 (CET)'),
          cksum: 5252,
          type: '0',
          linkpath: '',
          ustar: 'ustar\u0000',
          ustarver: '00',
          uname: '',
          gname: '',
          devmaj: 0,
          devmin: 0,
          fill: ''
        });
        file.on('error', t.fail.bind(t));
        file.pipe(concat(function(body) {
          t.equal(body.toString(), 'Olah!\n');
        }));
      }
      i++;
    })
    .on('end', t.ok.bind(t, true))
    .on('error', t.fail.bind(t));  
});
