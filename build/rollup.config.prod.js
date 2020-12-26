/*
 * @Author: shen
 * @Date: 2020-12-25 21:22:31
 * @LastEditors: shen
 * @LastEditTime: 2020-12-25 21:24:49
 * @Description: 
 */
import baseConfig from './rollup.config.base.js'
import { terser } from 'rollup-plugin-terser'

const config =  {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    terser()
  ]
}

export default config