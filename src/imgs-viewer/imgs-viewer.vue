<template>
  <transition name="viewer-fade">
    <div
      v-if="imgList.length && value"
      class="image-viewer__wrapper"
      :style="{ 'z-index': zIndex }"
    >
      <div class="image-viewer__mask" @click="closeOnClickMask && hide()"></div>
      <!-- CLOSE -->
      <span class="image-viewer__btn image-viewer__close" @click="hide">
        <i class="imgs-viewer-icon imgs-viewer-icon-close1"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="image-viewer__btn image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          <i class="imgs-viewer-icon imgs-viewer-icon-arrow-left-bold" />
        </span>
        <span
          class="image-viewer__btn image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          <i class="imgs-viewer-icon imgs-viewer-icon-arrow-right-bold" />
        </span>
      </template>
      <!-- TITLE -->
      <div v-if="currentTitle" class="image-viewer__title">
        {{ currentTitle }}
      </div>
      <!-- ACTIONS -->
      <div class="image-viewer__btn image-viewer__actions">
        <div class="image-viewer__actions__inner">
          <i
            class="imgs-viewer-icon imgs-viewer-icon-zoom-in"
            @click="handleActions('zoomOut')"
          ></i>
          <i
            class="imgs-viewer-icon imgs-viewer-icon-zoom-out"
            @click="handleActions('zoomIn')"
          ></i>
          <i class="image-viewer__actions__divider"></i>
          <i
            class="imgs-viewer-icon"
            style="width: 20px;font-size: 18px;text-align: center"
            :class="mode.icon"
            @click="toggleMode"
          ></i>
          <i class="image-viewer__actions__divider"></i>
          <i
            class="imgs-viewer-icon imgs-viewer-icon-refresh-left"
            @click="handleActions('anticlocelise')"
          ></i>
          <i
            class="imgs-viewer-icon imgs-viewer-icon-refresh-right"
            @click="handleActions('clocelise')"
          ></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="image-viewer__canvas">
        <img
          ref="img"
          :key="currentImg"
          class="image-viewer__img"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off, rafThrottle, isFirefox } from '../utils/index'
let prevOverflow = ''
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'imgs-viewer-icon-full-screen',
  },
  ORIGINAL: {
    name: 'original',
    icon: 'imgs-viewer-icon-scale-to-original',
  },
}
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'
export default {
  name: 'ImgsViewer',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    imgList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    closeOnClickMask: {
      type: Boolean,
      default: false,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    onSwitch: {
      type: Function,
      default: () => {},
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      index: 0,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
    }
  },
  computed: {
    isSingle() {
      return this.imgList.length <= 1
    },
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === this.imgList.length - 1
    },
    isSimple() {
      return typeof this.imgList[0] === 'string'
    },
    currentImg() {
      if (this.imgList.length) {
        if (this.isSimple) {
          return this.imgList[this.index]
        } else {
          return this.imgList[this.index].url
        }
      }
      return null
    },
    currentTitle() {
      if (this.imgList.length && !this.isSimple) {
        return this.imgList[this.index].title
      }
      return ''
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`,
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    },
  },
  watch: {
    value(val) {
      if (this.imgList.length) {
        if (val) {
          this.deviceSupportInstall()
          document.body.appendChild(this.$el)
          prevOverflow = document.body.style.overflow
          document.body.style.overflow = 'hidden'
        } else {
          this.deviceSupportUninstall()
          document.body.removeChild(this.$el)
          document.body.style.overflow = prevOverflow
          this.reset()
        }
      } else {
        if (val) {
          this.hide()
        }
      }
    },
    initialIndex(i) {
      if (this.imgList.length && i < this.imgList.length) {
        this.index = i
      }
    },
    index: {
      handler: function(val) {
        this.reset()
        this.onSwitch(val)
      },
    },
    currentImg(val) {
      this.$nextTick((_) => {
        const $img = this.$refs.img
        if ($img && !$img.complete) {
          this.loading = true
        }
      })
    },
  },
  methods: {
    hide() {
      this.$emit('input', false)
    },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle((e) => {
        const keyCode = e.keyCode
        switch (keyCode) {
          // ESC
          case 27:
            this.closeOnPressEscape && this.hide()
            break
          // SPACE
          case 32:
            this.toggleMode()
            break
          // LEFT_ARROW
          case 37:
            this.prev()
            break
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case 39:
            this.next()
            break
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut')
            break
        }
      })
      this._mouseWheelHandler = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false,
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false,
          })
        }
      })
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    handleImgLoad(e) {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return
      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', (ev) => {
        off(document, 'mousemove', this._dragHandler)
      })
      e.preventDefault()
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      }
    },
    toggleMode() {
      if (this.loading) return
      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    prev() {
      if (this.isFirst && !this.infinite) return
      const len = this.imgList.length
      this.index = (this.index - 1 + len) % len
    },
    next() {
      if (this.isLast && !this.infinite) return
      const len = this.imgList.length
      this.index = (this.index + 1) % len
    },
    handleActions(action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            )
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          break
      }
      transform.enableTransition = enableTransition
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/iconfont.scss';
.image-viewer {
  &__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    background: #000;
  }
  &__btn {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0.8;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
  }
  &__title {
    z-index: 1;
    position: absolute;
    left: 50%;
    top: 30px;
    transform: translateX(-50%);
    height: 44px;
    line-height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 22px;
    color: #fff;
    opacity: 0.8;
    box-sizing: border-box;
  }
  &__close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    .imgs-viewer-icon {
      font-size: 32px;
    }
  }
  &__next,
  &__prev {
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
    .imgs-viewer-icon {
      font-size: 24px;
    }
  }
  &__prev {
    left: 40px;
  }
  &__next {
    right: 40px;
    text-indent: 2px;
  }
  &__actions {
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 22px;
    &__inner {
      width: 100%;
      height: 100%;
      text-align: justify;
      cursor: default;
      font-size: 23px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .imgs-viewer-icon {
        font-size: 21px;
      }
      i {
        cursor: pointer;
      }
    }
  }
  &__canvas {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
