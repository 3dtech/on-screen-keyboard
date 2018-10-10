const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'keyboard.js',
    library: 'OSK',
    libraryTarget: 'umd',
    libraryExport: 'OSK',
    path: path.resolve(__dirname, 'dist')
  }
};
