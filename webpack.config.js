/* eslint-env node */
/* eslint no-console: "off" */

'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

module.exports = (env) => {
  return {
    context: __dirname + '/src',
    entry: __dirname + '/src/main.js',
    output: {
      path: __dirname + '/dist/app',
      filename: '[name].js'
    },
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
          test: /\.json$/,
          loader: 'file-loader'
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
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts'
              }
            }
          ]
        }
      ]
    },
    optimization: {
      noEmitOnErrors: true,
      namedModules: true,
      namedChunks: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/, // you may add "vendor.js" here if you want to
            name: 'vendor',
            chunks: 'initial',
            enforce: true
          }
        }
      },
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true,
          exclude: /\/.map/
        })
      ]
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
    mode: 'production',
    plugins: [
      new CopyWebpackPlugin([
        {from: '../assets', to: 'assets'}
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
      }),
      new ZipPlugin({
        path: '../zip',
        filename: `${new Date().toISOString()}_template.zip`,

        pathMapper: function(assetPath) {
          // put all pngs in an `images` subdir
          if (assetPath.endsWith('.png')) {
            return path.join(path.dirname(assetPath), 'images', path.basename(assetPath));
          }
          return assetPath;
        },

        exclude: [/\.map$/, /\.raw$/],

        fileOptions: {
          mtime: new Date(),
          mode: 0o100664,
          compress: true,
          forceZip64Format: false
        },

        zipOptions: {
          forceZip64Format: false
        }
      }),
      new CleanWebpackPlugin({
        verbose: true,
        cleanOnceBeforeBuildPatterns: [__dirname + 'dist/']
      })
    // new BundleAnalyzerPlugin()
    ],
    resolve: {
      modules: ['src', 'node_modules']
    }
  };
};

