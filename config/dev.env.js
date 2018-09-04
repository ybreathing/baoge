'use strict'
// 引入webpack-merge模块
const merge = require('webpack-merge')
// 引入prod.env.js
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

// 在“dev.env.js”中，先引入了webpack-merge这个模块。
// 这个模块的作用是来合并两个配置文件对象并生成一个新的配置文件，有点儿类似于es6的object.assign();

// vue-cli中将一些通用的配置抽出来放在一个文件内，在对不同的环境配置不同的代码，最后使用webpack-merge来进行合并，减少重复代码，
// 正如文档中所说，“webpack遵循不重复原则(Don't repeat yourself - DRY)，不会再不同的环境中配置相同的代码”
