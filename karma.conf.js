module.exports = function(config) {
  config.set({
    frameworks: [
      'mocha'
    ],
    files: [
      'dist/authclient.js',
      'dist/test.js'
    ],
    browsers: [
      'Chrome'
    ]
  });
};
