#!/usr/bin/env node

var fmt = require('../lib/fmt').fmt,
    opt = require('optimist'),
    util = require('util');

opt.usage('Usage: $0 file.js [file.js]...\n' +
          'Reformats JavaScript code to it\'s canonical form')
   .alias('h', 'help')
   .describe('h', 'Display this help and exist');

var argv = opt.argv;

if (0 === argv._.length) {
  opt.showHelp();
  process.exit(1);
}
for (var i=0; i < argv._.length; i++) {
  var filename = argv._[i];
  fmt(filename, function (err, code) {
    if (err) {
      process.stderr.write(err.toString() + '\n');
      process.exit(1);
    } else {
      process.stdout.write(code);
    }
  });
}