var test = require('tap').test;
var files = require('..');
var concat = require('concat-stream');

test('files', function(t) {
  t.plan(4);
  var i = 0;
  files('npm-files-test')
    .on('end', t.ok.bind(t, true))
    .on('error', t.fail.bind(t))
    .on('file', function(file) {
      if (i == 0) {
        t.equal(file.path, 'package.json');
      } else {
        t.equal(file.path, 'index.js')
        file.on('error', t.fail.bind(t));
        file.pipe(concat(function(body) {
          t.equal(body.toString(), 'Olah!\n');
        }));
      }
      i++;
    });
});

test('destroy', function(t) {
  t.plan(1);
  var f = files('npm-files-test');
  f.once('file', function() {
    f.destroy();
    f.on('data', function() {
      t.fail();
    });
    setTimeout(function() {
      t.ok(true);
    }, 1000);
  });
});
