// const path = require('path');

// module.exports = {
//   mode: 'development',
//   entry: './src/index.js', // Your main JavaScript file
//   devServer: {
//     static: './dist',
//   },
//   output: {
//     filename: 'bundle.js', // The output bundle
//     path: path.resolve(__dirname, 'dist'), // Output directory
//   },
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Make sure to install this plugin

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Your main JavaScript file
  output: {
    filename: 'bundle.js', // The output bundle
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before emit
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'World Map Simple: Azimuthal Equidistant Projection',
      template: './index.html', // Path to your template
      filename: 'index.html', // Output file
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // Use these loaders for CSS files
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve from the dist directory
    },
    compress: true,
    port: 8080,
  },
};