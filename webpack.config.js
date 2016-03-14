var path = require('path');
var webpack = require('webpack');

function clone(x) {
   return JSON.parse(JSON.stringify(x));
}

var base = {
  entry: [
  ],
  output: {
    path: __dirname
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel',
        query: {
          presets: ['stage-0']
        }
      }
    ]
  }
};

var main = clone(base);
main.entry.push('babel-polyfill');
main.entry.push('./src/index.js');
main.output.filename = 'dist/authclient.js';
main.output.libraryTarget = 'var';
main.output.library = '_RMAUTH';

var test = clone(base);
test.entry.push('./test/browser/test.js');
test.output.filename = 'dist/test.js';
test.output.libraryTarget = 'var';
test.output.library = '_RMTEST';

module.exports = [
  main,
  test
];
