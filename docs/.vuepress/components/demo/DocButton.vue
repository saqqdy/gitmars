// catButton 的type属性 示例
<template>
    <!-- 注意这里代码必须再包裹一层div，否则会解析报错 -->
    <div>
        <doc-button text="default"></doc-button>
        <doc-button text="primary" type="primary"></doc-button>
        <doc-button text="success" type="success"></doc-button>
        <doc-button text="info" type="info"></doc-button>
        <doc-button text="warning" type="warning"></doc-button>
        <doc-button text="danger" type="danger"></doc-button>
        <doc-button text="text" type="text"></doc-button>
    </div>
</template>
<script>
export default {}
</script>
