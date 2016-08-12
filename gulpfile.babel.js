#!/usr/bin/env node
'use strict'

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import del from 'del'

import config from './config'


const $ = gulpLoadPlugins()

// ------------------------------------
// 清理编译目录
// ------------------------------------
gulp.task('clean', () =>
  del.sync(config.dir_dist, { dot: true })
)