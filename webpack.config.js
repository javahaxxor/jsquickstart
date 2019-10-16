/* eslint-env node */
/* eslint no-console: "off" */

'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');

module.exports = (env) => {
  return {
    context: __dirname + '/src',
    entry: __dirname + '/src/main.js',
    module: {
      rules: [
        {
          test: /\.txt$/,
          loader: 'raw-loader'
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader'
          }]
        },
        {
          test: /\.css$/,
          loader: 'style-loader',
          options: {
            sourceMap: true
          }
        },
        {
          test: /\.css$/,
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                publicPath: '../',
                hmr: process.env.NODE_ENV === 'development'
              }
            },
            'css-loader', 'sass-loader'
          ]
        },
        {
          test: /\.json$/,
          loader: 'file-loader'
        }
      ]
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js'
    },
    devtool: 'source-map',
    devServer: {
      stats: {colors: true},
      contentBase: __dirname + '/dist',
      inline: true,
      noInfo: false,
      host: '127.0.0.1',
      port: 8000,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 500 // is this the same as specifying --watch-poll?
      }
    },
    mode: 'development',
    plugins: [
      new CopyWebpackPlugin([
      ]),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: 'templates/index.template.ejs',
        title: 'Widget',
        inject: 'body'
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false // Enable to remove warnings about conflicting order
      })
    ],
    resolve: {
      modules: ['src', 'node_modules']
    }
  };
};

