const webpack = require ('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,            //includes jsx for react now
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']        //here also indicates react and js files to be run through babel loader
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // devServer: {
  //     contentBase: path.resolve(__dirname, './dist'),
  // },
};