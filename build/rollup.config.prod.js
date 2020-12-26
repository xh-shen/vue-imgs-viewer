/*
 * @Author: shen
 * @Date: 2020-12-25 21:22:31
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 15:21:23
 * @Description: 
 */
import baseConfig from './rollup.config.base.js'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行

const config =  {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    css({ output: 'index.css' }),
    terser()
  ]
}

export default config