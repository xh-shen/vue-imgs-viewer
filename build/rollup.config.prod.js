/*
 * @Author: shen
 * @Date: 2020-12-25 21:22:31
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 12:57:09
 * @Description: 
 */
import baseConfig from './rollup.config.base.js'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行
import CleanCSS from 'clean-css' // 压缩css
import { writeFileSync } from 'fs' // 写文件
import { name } from '../package.json'


const config =  {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    css({ output(style) {
      writeFileSync(`dist/${name}.css`, new CleanCSS().minify(style).styles)
    } }),
    terser()
  ]
}

export default config