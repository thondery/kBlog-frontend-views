'use strict'

import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { readdirSync } from 'fs'

import config from './config'

const paths = config.utils_paths

const webpackConfig = {
  name: 'http:config',
  target: 'web',
  resolve: {
    root: paths.src(),
    extensions: ['', '.js', '.json'],
    alias: {
      jquery: "jquery/src/jquery"
    }
  },
  module: {},
  //devtool: 'source-map'
}

// ------------------------------------
// Entry Points
// ------------------------------------
webpackConfig.entry = Object.assign(
  {
    vendor: config.compiler_vendor
  }, 
  getEntry('./src')
)


// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  path: paths.dist(),
  filename: 'js/[name].bundle.js',
  publicPath: '../'
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
  new ExtractTextPlugin('css/[name].bundle.css')
]

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [
  {
    test: /\.(js)?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: true,
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-runtime']
    }
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  }
]

// ------------------------------------
// Style Loaders
// ------------------------------------
webpackConfig.module.loaders.push(
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'css?sourceMap!' + 'autoprefixer-loader'
    )
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'css?sourceMap&-restructuring!' + 'autoprefixer-loader!' + 'sass?sourceMap'
    )
  }
)

// ------------------------------------
// File Loaders
// ------------------------------------
webpackConfig.module.loaders.push(
  {
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader?mimetype=image/png&limit=8192&name=img/[sha512:hash:base64:7].[ext]'
  },
  {
    test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
    loader: 'url-loader?importLoaders=1&limit=10000&name=fonts/[name].[ext]'
  }
)

function getEntry (path) {
  let [files, tag, entry] = [readdirSync(path), null, {}]
  files.forEach( filename => {
    if (/\.(js)$/.test(filename)) {
      tag = filename.replace(/\.(js|jsx)$/, '')
      entry[tag] = path + '/' + filename
    }
  })
  return entry
}

export default webpackConfig