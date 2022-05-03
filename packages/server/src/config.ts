import { resolve } from 'path'

const baseDir = resolve(__dirname, '.')
const root = resolve(baseDir, '..')

export default {
    path: {
        root,
        controller: resolve(baseDir, 'controller'),
        utils: resolve(baseDir, 'utils'),
        service: resolve(baseDir, 'service'),
        model: resolve(baseDir, 'model'),
        routes: resolve(baseDir, 'routes'),
        schedule: resolve(baseDir, 'schedule'),
        view: resolve(baseDir, 'view'),
        mongo: resolve(baseDir, 'mongo'),
        redis: resolve(baseDir, 'redis'),
        public: resolve(baseDir, 'public'),
        log: resolve(baseDir, 'log'),
        logger: resolve(baseDir, 'log/logger')
    },
    cookieSecret: 'gitmars', // 用于cookie的签名
    socketWhiteList: {
        // 建立socket连接的白名单
        localhost: true,
        '127.0.0.1': true
    },
    redisNamespace: {
        // redis用到的命名空间
        socket: 'socket', // 存放用户对应的socketId
        rsa: 'rsa', // rsa 存放ip对应的公钥与私钥
        msgCode: 'msgCode' // code 存放ip对应的短信验证码
    },
    mongo: null, // 连接mongo用到的配置
    mysql: null, // 连接mysql用到的配置
    redis: null // 连接redis用到的配置
}
