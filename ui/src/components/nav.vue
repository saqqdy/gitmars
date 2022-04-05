<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        234
        <h1>{{ m }}</h1>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
    name: 'V3Nav',
    props: {
        msg: String
    },
    setup() {
        const m = ref(null)
        onMounted(() => {
            setTimeout(() => {
                m.value = 10000
            }, 3000)
        })
        return {
            m
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
