var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var extractSass = new ExtractTextPlugin({
    filename: "dev_assets/[name].[contenthash].css"
});

module.exports = {
  entry: ['./src/js/index.js', './src/scss/rc_controller.scss'],
  output: {
    filename: 'dev_assets/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'www')
  },
  module: {
        rules: [
        {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [ path.resolve(__dirname, 'src/scss')]
                    }
                }]
            })
        },
        {
            test: /\.json$/,
            use: 'json-loader'
        },
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [['es2015', {modules: false}]],
                    plugins: [
                        'syntax-dynamic-import',
                        'transform-async-to-generator',
                        'transform-regenerator',
                        'transform-runtime'
                    ]
                }
            }]
        }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    extractSass,
    new HtmlWebpackPlugin({
      title: require('./app_config.json').app_name,
      inlineSource: '.(js|css)$',
      template: './src/html/index.html'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};


