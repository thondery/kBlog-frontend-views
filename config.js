'use strict'

import path from 'path'
import pngquant from 'imagemin-pngquant'

const config = {
  env: process.env.NODE_ENV || 'development',
  path_base: path.resolve(__dirname, './'),
  dir_dist: 'dist',
  dir_src: 'src',
  dir_view: 'views',
  dir_data: 'jsondata',
  dev_host: 'localhost',
  dev_port: 4000,
  compiler_vendor: [
    'jquery',
    'bootstrap',
    'bootstrap/dist/css/bootstrap.css',
    'font-awesome/css/font-awesome.css',
    'flex.css/dist/flex.css'
  ]
}

// ------------------------------------
// 第三方资源
// ------------------------------------
config.vendor = {
  filename: 'vendor',
  js: [],
  css: [],
  copys: []
}

config.vendor.js.push(
  './node_modules/jquery/dist/jquery.js',
  './node_modules/bootstrap/dist/js/bootstrap.js'
)

config.vendor.css.push(
  './node_modules/bootstrap/dist/css/bootstrap.css',
  './node_modules/font-awesome/css/font-awesome.css'
)

config.vendor.copys.push(
  './node_modules/bootstrap/dist/fonts/*.+(eot|svg|ttf|woff|woff2)',
  './node_modules/font-awesome/fonts/*.+(eot|svg|ttf|woff|woff2|otf)'
)

// ------------------------------------
// 自定义资源
// ------------------------------------
config.assets = {
  style: {
    entry: ['./assets/sass/*.scss'],
    autoprefixer: {
      rowsers: [
        'last 2 versions', 
        'safari 5', 
        'ie 8', 
        'ie 9', 
        'opera 12.1', 
        'ios 6', 
        'android 4'
      ],
      cascade: false
    },
    sprite: {
      'spriteSheet': config.dir_dist + '/img/sprite.png',
      'pathToSpriteSheetFromCSS': '../img/sprite.png'
    }
  },
  image: {
    file: ['./assets/img/**/*.+(jpg|gif|png|svg)'],
    opts: {
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 5,
      use: [pngquant()]
    }
  }
}

config.views = {
  entry: [config.dir_view + '/*.+(htm|html)'] 
}

// ------------------------------------
// Utilities
// ------------------------------------
const resolve = path.resolve
const base = (...args) =>
  Reflect.apply(resolve, null, [config.path_base, ...args])

config.utils_paths = {
  base: base,
  src: base.bind(null, config.dir_src),
  dist: base.bind(null, config.dir_dist),
  view: base.bind(null, config.dir_view),
  data: base.bind(null, config.dir_data)
}

export default config