'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  // 处理路径
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  // 基础目录
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js' // 入口文件
  },
  output: {
    path: config.build.assetsRoot,  // 输出文件，默认'../dist'
    filename: '[name].js', //输出文件名称
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath // 生产模式publicpath
      : config.dev.assetsPublicPath // 开发模式publicpath
  },
  resolve: {
    // 解析确定的拓展名，方便模块导入
    extensions: ['.js', '.vue', '.json'],
    // 设置别名 方便其他页面应用
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'api': path.resolve(__dirname, '../src/api'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router')
    }
  },
  module: {
    //模块相关配置，包括loader，plugin等
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),  // Eslint语法限制 
      {
        test: /\.vue$/,  // vue 要在babel之前 
        loader: 'vue-loader', // vue转普通的html
        options: vueLoaderConfig //可选项：vue-loader 选项配置
      },
      {
        test: /\.js$/,  // babel
        loader: 'babel-loader', //es6转es5loader
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        // url-loader 文件大小低于指定的限制时，可返回 DataURL，即base64
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // url-loader 图片
        loader: 'url-loader',
        options: {
          // 兼容性问题需要将query换成options
          limit: 10000,  // 默认无限制
          name: utils.assetsPath('img/[name].[hash:7].[ext]') // hash:7 代表 7 位数的 hash
        }
      },
      {
        // url-loader 音视频
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // url-loader 字体
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // 是否 polyfill 或 mock
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
