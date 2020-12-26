<!--
 * @Author: shen
 * @Date: 2020-12-25 10:52:41
 * @LastEditors: shen
 * @LastEditTime: 2020-12-26 14:11:39
 * @Description:
-->

# vue-imgs-viewer

## Attribute

| 参数                  | 说明                                                 | 类型            | 默认值 |
| --------------------- | ---------------------------------------------------- | --------------- | ------ |
| v-model               | 显示隐藏                                             | boolean         | false  |
| img-list              | 图片数据列表['url'] 或[{url: 'url', title: 'title'}] | array           | -      |
| z-index               | css 层级                                             | number          | 2000   |
| close-on-click-mask   | 是否可以通过点击遮罩关闭 ImageViewer                 | boolean         | false  |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 ImageViewer                | boolean         | true   |
| initial-index         | 默认打开的图片索引                                   | number          | 0      |
| on-switch             | 切换回调                                             | function(index) | -      |

## Keyboard Operation

| Keyboard               | 说明                       |
| ---------------------- | -------------------------- |
| SPACE(空格键)          | 切换原图大小或屏幕缩放大小 |
| LEFT_ARROW(左方向键)   | 切换到上一张图片           |
| RIGHT_ARROW (右方向键) | 切换到下一张图片           |
| UP_ARROW(上方向键)     | 放大图片                   |
| DOWN_ARROW(下方向键)   | 缩小图片                   |

## 示例

```vue
<template>
  <div>
    <image-viewer
      v-model="showViewer"
      :initial-index="imageIndex"
      :img-list="srcList"
    />
  </div>
</template>
```
