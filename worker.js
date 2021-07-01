const RequestParser = require("./requestParser");
const makeResponse = require("./makeResponse");

module.exports = (connection) => {
    const parser = new RequestParser()
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
        // ...
        // make response
        connection.end(makeResponse(message))
    })
}
