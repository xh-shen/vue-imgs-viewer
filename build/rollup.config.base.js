/*
 * @Author: shen
 * @Date: 2020-12-25 21:21:32
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 12:56:19
 * @Description: 
 */
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import vue from "rollup-plugin-vue"
import { name, main, module } from '../package.json'

const config =  {
  input: 'src/index.js',
  external: ['vue'], 
  output: [
    { file: main, format: 'umd', name, globals: {vue: 'Vue'} },
    { file: module, format: 'es', name, exports: 'default', globals: {vue: 'Vue'} }
  ],
  plugins: [
    json(),
    resolve(),
    vue({
      css: false,
      compileTemplate: true
    }),
    babel({
      exclude: "**/node_modules/**",
      babelHelpers: "bundled",
      presets: ["@vue/babel-preset-jsx"]
    }),
    commonjs()
  ]
}

export default config