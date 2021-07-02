const RequestParser = require("./requestParser");
const makeResponse = require("./makeResponse");
const path = require("path");
const POSTPlugin = require('./plugins/POSTPlugin')
const GETPlugin = require('./plugins/GETPlugin')
const PUTPlugin = require('./plugins/PUTPlugin')
const DELETEPlugin = require('./plugins/DELETEPlugin')

module.exports = (connection) => {
    const parser = new RequestParser()

    const env = {
        // 转换成绝对路径
        root: path.resolve('./resources')
    }

    // 判断缓冲区是否有数据
    connection.on('data', (buffer) => {
        // 读取并解析数据
        parser.append(buffer)
    })


    // Request 是否完毕
    // on 方法是继承自events类
    // 文本解析结束，生成响应
    parser.on('finish', (message) => {
        // plugin 0
        message = POSTPlugin(message, env)
        message = GETPlugin(message, env)
        message = PUTPlugin(message, env)
        message = DELETEPlugin(message, env)
        // message=GETPlugin(message,env)
        // ...
        // make response
        connection.end(makeResponse(message))
    })
}
