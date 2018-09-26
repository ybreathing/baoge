'use strict'
const utils = require('./utils')
// 使用 webpack
const webpack = require('webpack')
// 获取 config/index.js 的默认配置
const config = require('../config')
// 用于合并webpack的配置文件
const merge = require('webpack-merge')
const path = require('path')
// webpack基本配置文件（开发时和运行时公用）
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
/**
 * [HtmlWebpackPlugin description]
 * @type {[type]}
 * 这个插件的作用是依据一个简单的模板，帮你生成最终的Html5文件，
 * 这个文件中自动引用了你打包后的JS文件。每次编译都在文件名中插入一个不同的哈希值
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 能够更好在终端看到webapck运行的警告和错误
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 自动检索下一个可用端口
const portfinder = require('portfinder')
// 读取系统环境变量的host
const HOST = process.env.HOST
// 读取系统环境变量的port
const PORT = process.env.PORT && Number(process.env.PORT)
// 合并baseWebpackConfig配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 对一些独立的css文件以及它的预处理文件做一个编译
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool, // 添加元信息(meta info)增强调试

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning', // console 控制台显示的消息，可能的值有 none, error, warning 或者 info
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true, //开启热加载
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true, //开启压缩
    host: HOST || config.dev.host, // process.env 优先
    port: PORT || config.dev.port, // process.env 优先
    open: config.dev.autoOpenBrowser, //自动打开浏览器，这里是默认是false，所以不会自动打开
    overlay: config.dev.errorOverlay // warning 和 error 都要显示
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, //代理设置，用于前后端分离
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: { //启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改
      poll: config.dev.poll, // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。默认为false
    }
  },
  plugins: [
    // webpack一些构建用到的插件
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 模块热替换它允许在运行时更新各种模块，而无需进行完全刷新
    new webpack.HotModuleReplacementPlugin(), 
    new webpack.NamedModulesPlugin(), // 热加载时直接返回更新的文件名，而不是id  // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(), // 跳过编译时出错的代码并记录下来，主要作用是使编译后运行时的包不出错
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // 指定编译后生成的html文件名
      filename: 'index.html',
      // 需要处理的模板
      template: 'index.html',
      // 打包过程中输出的js、css的路径添加到html文件中
      // css文件插入到head中
      // js文件插入到body中，可能的选项有 true, 'head', 'body', false
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port // 获取当前设定的端口
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // process 发布端口
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
       // 设置 devServer 端口
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({ // 错误提示插件
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
