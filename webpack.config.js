var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

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
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
              ],
        },
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
            }]
        }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "dev_assets/[name].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      title: require('./app_config.json').app_name,
      inlineSource: '.(js|css)$',
      template: './src/html/index.html'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};
