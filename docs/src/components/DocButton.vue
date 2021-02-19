<template>
    <el-button :text="text" v-bind="$attrs" v-on="$listeners">{{ text }}</el-button>
</template>
<script>
export default {
    name: 'DocButton',

    props: {
        text: {
            type: String
        }
    },

    data() {
        return {}
    },

    methods: {}
}
</script>
