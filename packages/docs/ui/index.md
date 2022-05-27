---
sidebar: null
---

## gitm ui介绍

> 3.0.0版本开始，UI界面从原gitmars项目中抽离成了独立项目`@gitmars/ui`

如果你厌倦了敲指令，gitmars提供了懒人UI界面

-   安装：`gitm install @gitmars/ui`
-   使用：`gitm ui [-p --port [port]]`
-   传值：

<div class="table-option">

| 名称   | 简写 | 说明       | 类型   | 可选值 | 传值必填 | 默认 |
| ------ | ---- | ---------- | ------ | ------ | -------- | ---- |
| --port | -p   | 启动端口号 | Number | -      | 否       | 3000 |

</div>

-   示例：

```shell
gitm ui --port 3000
```

-   演示：

![gitmars-ui.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-ui.gif)
