const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Your main JavaScript file
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'bundle.js', // The output bundle
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
