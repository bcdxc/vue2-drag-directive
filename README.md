# vue2-drag-directive  [![](https://img.shields.io/npm/v/vue2-drag-directive.svg)](https://www.npmjs.com/package/vue2-drag-directive)

基于 vue.js 2.x 的拖动指令


## 说明

* 将绑定指令的DOM元素以fixed形式设置为可移动
* 同时支持PC端与移动端


## 安装

使用 npm 或 yarn 安装：

```shell
npm i -S vue2-drag-directive

// or

yarn add vue2-drag-directive
```

## 使用

```js
import Vue from 'vue'
import Vue2DragDirective from 'vue2-drag-directive'

Vue.use(Vue2DragDirective)
```

在你的 `.vue` 文件中:

```html
<div v-drag>draggable</div>
```

## APIs

### 指令可接收一个配置对象
|       属性       |   类型   |             说明              | 函数参数或默认值                          |
| :--------------: | :------: | :---------------------------: | :---------------------------------------- |
| isBeyondDocument | Boolean  | 移动时DOM元素是否可以超出文档 | false                                        |
|      start       | Function |          按下时执行           | { top, left, pointX, pointY }             |
|      moving      | Function |          拖动时执行           | { pointX, pointY, offsetTop, offsetLeft } |
|       end        | Function |          抬起时执行           | { pointX, pointY, top, left }             |


## LICENSE

MIT License
