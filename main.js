let net = require('net')
let worker = require('./worker')
// 从net模块获取连接
net.createServer((connection) => {
    worker(connection)
})
    .listen(80)
// 从连接读取字节流

// 解析字节流中的HTTP Request数据

// 根据HTTP Request数据对资源进行操作

// 将操作结果以HTTP Response数据形式返回

// 将HTTP Response转为自己流写回到连接中
