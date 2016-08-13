#!/usr/bin/env node
'use strict'

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import sequence from 'run-sequence'
import del from 'del'
import minifyCss from 'gulp-minify-css'
import sprite from 'gulp-css-spriter'
import path from 'path'
import { readFileSync } from 'fs'

import config from './config'
import compile from './webpack.config'


const $ = gulpLoadPlugins()
const Run = sequence.use(gulp)
const { vendor, assets, views } = config
const paths = config.utils_paths

// ------------------------------------
// 清理编译目录
// ------------------------------------
gulp.task('clean', () =>
  del.sync(paths.dist(), { dot: true })
)

// ------------------------------------
// 编译样式表
// ------------------------------------
gulp.task('assets-style', () =>
  gulp.src(assets.style.entry)
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.autoprefixer(assets.style.autoprefixer))
      .pipe(sprite(assets.style.sprite))
      .pipe(minifyCss())
      .pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.dist('css')))
)

// ------------------------------------
// 处理图片文件
// ------------------------------------
gulp.task('assets-image', () => 
  gulp.src(assets.image.file)
      .pipe($.imagemin(assets.image.opts))
      .pipe(gulp.dest(config.dir_dist + '/img'))
)

// ------------------------------------
// 处理样式表资源
// ------------------------------------
gulp.task('assets', () =>
  Run('assets-style', ['assets-image'])
)

// ------------------------------------
// 编译JS源码
// ------------------------------------
gulp.task('compile', () =>
  gulp.src('./src/index.js')
      .pipe($.webpack(compile))
      .pipe(gulp.dest(paths.dist()))
)

// ------------------------------------
// 输出Html
// ------------------------------------
gulp.task('html', () =>
  gulp.src(views.entry)
      .pipe($.data(getData))
      .pipe($.swig({ defaults: { cache: false } }))
      .pipe(gulp.dest(paths.dist()))
)

// ------------------------------------
// 调试服务
// ------------------------------------
gulp.task('server', () =>
  gulp.src(config.dir_dist)
      .pipe($.webserver({
        host: config.dev_host,
        port: config.dev_port,
        fallback: 'index.html',
        livereload: true,
        directoryListing: false,
        open: false
      }))
)

// ------------------------------------
// 编译工程
// ------------------------------------
gulp.task('build', () =>
  Run('clean', ['compile'], ['assets'])
)

// ------------------------------------
// 调试工程
// ------------------------------------
gulp.task('dev', () =>
  Run('clean', ['compile'], ['assets', 'html'], ['server', 'watch'])
)

//gulp.task('output', ['compile', 'assets', 'output－html'])

// ------------------------------------
// 监听文件变化
// ------------------------------------
gulp.task('watch', () => {
  $.watch(['./src/**/*.+(js|json)'], () => Run('compile'))
  $.watch(['./views/**/*.+(htm|html)', './jsondata/**/*.json'], () => Run('html'))
  $.watch(['./assets/**/*.+(scss|jpg|png|gif|svg)'], () => Run('assets'))
})


// ------------------------------------
// 获取Html数据
// ------------------------------------
const getData = file => {
  let jsonData = path.basename(file.path).replace(/\.(html|htm)$/i, '.json')
  let data = JSON.parse(readFileSync(paths.data(jsonData), 'utf-8') || '{}')
  return data
}