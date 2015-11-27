// Example webpack configuration with asset fingerprinting in production.
'use strict';

var path = require('path');
var url = require('url');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var PATHS = {
  app: path.join(__dirname, 'app'),
  angularD3: './index.js',
  dist: path.join(__dirname, 'dist'),
  docs: path.join(__dirname, 'docs'),
}

var config = {
  entry: {
    "angularD3": PATHS.angularD3,
    "app": PATHS.app,
  },
  resolve: { extensions: ['', '.js', '.coffee'], },
  output: {
    path: PATHS.dist,
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.scss$/, loader: "style!css!sass-loader" },
      { test: /\.(ttf|svg|png|gif|jpg|woff|woff2|eot|csv)$/, loader: "file" },
      { test: /\.html$/, loader: "ngtemplate!html" },
    ]
  },
}

if (process.env.BUILD_ASSETS === "true") {
  console.log("Building assets...")
  config.entry = { "angularD3": PATHS.angularD3 }
  config.devtool = 'source-map'
  config.output.devtoolModuleFilenameTemplate = '[resourcePath]'
  config.output.devtoolFallbackModuleFilenameTemplate = '[resourcePath]?[hash]'
  config.externals ={ "angular": "angular", "d3": "d3"}

} else if (process.env.BUILD_DOCS === "true") {
  config.devtool = 'source-map'
  config.output.path = PATHS.docs
  config.output.devtoolModuleFilenameTemplate = '[resourcePath]'
  config.output.devtoolFallbackModuleFilenameTemplate = '[resourcePath]?[hash]'
  config.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.app, 'index.html'),
      favicon: path.join(PATHS.app, 'favicon.ico'),
      inject: 'body'
    })
  ]

} else {
  config.devtool = 'cheap-module-eval-source-map';
  config.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.app, 'index.html'),
      favicon: path.join(PATHS.app, 'favicon.ico'),
      inject: 'body'
    })
  ]
}

module.exports = config;
