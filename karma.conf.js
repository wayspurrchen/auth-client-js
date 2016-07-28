var path = require('path');

var babelLoader = path.resolve(__dirname, 'node_modules/babel-loader') +
    '?' + ['babel-preset-es2015', 'babel-preset-stage-0'].map(function(s) {
        // Miserable fix from https://github.com/babel/babel-loader/issues/166#issuecomment-160866946
        return 'presets[]=' + require.resolve(s);
    }).join(',');

module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },
    frameworks: [
      'mocha'
    ],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/browser/test.js',
      'test/node/test.js'
    ],
    browsers: [
      'Chrome'
    ],
    webpack: {
        devtool: 'inline-source-map',
        resolveLoader: {
            root: path.join(__dirname, "node_modules")
        },
        resolve: {
            root: path.resolve(__dirname, 'src'),
            modulesDirectories: ['node_modules'],
            extensions: ['', '.js', '.json']
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loaders: [babelLoader],
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json'
            }]
        }
    },
    webpackServer: {
        noInfo: true
    }
  });
};
