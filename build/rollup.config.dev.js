/*
 * @Author: shen
 * @Date: 2020-12-25 21:21:54
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 14:08:22
 * @Description: 
 */

import baseConfig from './rollup.config.base.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行
import { writeFileSync } from 'fs' // 写文件
import { name } from '../package.json'

const config =  {
  ...baseConfig,
  watch: {
    include: 'src/**'
  },
  plugins: [
    ...baseConfig.plugins,
    serve({
      open: false,
      port: '4300',
      openPage: '/example/index.html',
      contentBase: ''
    }),
    livereload('dist'),
    css({ output(style) {
      writeFileSync(`dist/${name}.css`, style)
    } }),
  ]
}
export default config