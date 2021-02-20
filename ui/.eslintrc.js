const { vue3: config } = require('eslint-config-sets')
module.exports = Object.assign(config, {
    rules: {
        semi: [2, 'never']
    }
})
