var files = require('./');

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