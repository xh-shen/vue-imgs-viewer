/*
 * @Author: shen
 * @Date: 2020-12-25 11:03:17
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 09:38:50
 * @Description: 
 */

// Import vue component
import ImgsViewer from "./imgs-viewer/index"

ImgsViewer.install = function(Vue) {
  Vue.component(ImgsViewer.name, ImgsViewer)
}

// 自动注册组件
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(ImgsViewer.name, ImgsViewer)
}

export default ImgsViewer