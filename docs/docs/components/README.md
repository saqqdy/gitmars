---
title: 组件
sidebarDepth: 4
---

# h1

## h2

<<< @/./docs/components/cell/cell.vue

### h3

| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |

![gitmars](@assets/logo.png)

<!-- 说明： -->
<!-- base-CodeBox 组件即为.vuepress/components/base/codeBox文件，vuepress会默认把它解析为`base-CodeBox`组件;  title为代码示例标题；description为代码示例说明；onlineLink为在线运行配置的网址 -->

<!-- 同理demo-DocButton即为编写的代码示例组件 -->

<!-- highlight-code为引入的第三方代码高亮组件，里面包裹的就是上面示例组件的代码 -->

<base-CodeBox title="按钮类型"
  description="按钮类型通过设置type为primary、success、info、warning、danger、text创建不同样式的按钮，不设置为默认样式。"
  onlineLink="https://codepen.io/saqqdy/pen/KjEOWO">
<demo-DocButton></demo-DocButton>

  <!-- 这里直接设置 引入的展示代码 ；注意引入代码一定不能缩进！！！否则不能生效！-->
  <highlight-code slot="codeText" lang="vue">
<<< @/docs/.vuepress/components/demo/DocButton.vue
  </highlight-code>
</base-CodeBox>

<!-- 组件的参数表格,这里我没有使用自带的markdown表格，因为太丑，样式不好修改，有时参数描述较少时，不能自动撑满一行，所以自己写了一个组件；titile为表格标题，tableHead为表头，tableBody为具体参数设置，并且支持el-table的table参数 -->
<base-ApiTable title="Attributes" :tableBody="tableBody" :tableHead="tableHead">
</base-ApiTable>

<!-- 给个star 彩蛋组件 -->

<base-Star></base-Star>

<!-- 第三方评论插件 -->
<Vssue title="" />

<!-- 其实在vuepress里的每个.md其实和.vue很像的，你基本可以按照vue组件模式来写 -->
<script>
  export default {
    data() {
      return {
        //表头为字符串，写法和md一样，中间以`|`间隔就行
        tableHead: `参数 | 说明 | 类型 | 可选值 | 默认值`,
        //表格数据为数组，其中每一项为字符串，代表每一行要展示的数据，写法也和md一样，中间以`|`间隔就行
        tableBody: [
          `size | 尺寸 | String | medium / small / mini | —`,
          `type |	类型 | string |	primary / success / warning / danger / info / text | —`
        ],
      }
    },

  }
</script>

<!-- 和vue一样，也可以设置样式，并且这里style样式只对当前md有效，不需要加上scoped -->
<style>
</style>
