/*
 * @Author: shen
 * @Date: 2020-12-25 21:21:54
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 15:21:14
 * @Description: 
 */

import baseConfig from './rollup.config.base.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行

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
    css({ output: 'index.css' })
  ]
}
export default config