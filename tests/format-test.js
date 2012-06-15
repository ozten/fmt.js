var assert = require('assert'),
    fmt = require('../lib/fmt').fmt,
    fs = require('fs'),
    path = require('path'),
    vows = require('vows');

var suite = vows.describe('fmt.js regression tests');
suite.addBatch({
  'fmt basic.js': {
    topic: function () {
      fmt(path.join(__dirname, 'basic.js'), this.callback);
    },
    'then read in basic_expected.js': {
      topic: function (pretty) {
        this.pretty = pretty;
        fs.readFile(path.join(__dirname, 'basic_expected.js'), 
                    this.callback);
      },
      "they are identical": function (err, js) {
        assert.equal(this.pretty, js.toString('utf8'));
      }
    }
  },
  'fmt main.js': {
    topic: function () {
      fmt(path.join(__dirname, 'main.js'), this.callback);
    },
    'then read in main_expected.js': {
      topic: function (pretty) {
        this.pretty = pretty;
        fs.readFile(path.join(__dirname, 'main_expected.js'), 
                    this.callback);
      },
      "they are identical": function (err, js) {
        assert.equal(this.pretty, js.toString('utf8'));
      }
    }
  }
});

// run or export the suite.
if (process.argv[1] === __filename) {
  suite.run();
} else {
  suite.export(module);
}
