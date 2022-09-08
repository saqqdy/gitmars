import type { GitmarsOptionType } from '../../typings'
import i18n from '../locales'

const cmdConfig: GitmarsOptionType = {
    command: 'unlink',
    short: null,
    args: [
        {
            required: false,
            name: 'name',
            variadic: false,
            validator: (val, opts, cb) => {
                if (/\s+/.test(val)) {
                    cb(new Error(i18n.__('Please do not enter spaces')))
                    return
                }
                cb()
            },
            // transformer: null,
            description: i18n.__('Name of the package')
        }
    ],
    options: []
}

export default cmdConfig
