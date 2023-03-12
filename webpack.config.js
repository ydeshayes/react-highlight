const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
var path = require('path');

var libraryName = 'Highlightable';

var plugins = [], outputFile;

outputFile = libraryName + '.min.js';

var config = {
  entry: __dirname + '/src/index.ts',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /(\.tsx|\.ts)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.tsx', '.ts']
  },
  plugins: plugins
};

module.exports = config;
