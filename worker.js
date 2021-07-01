const RequestParser = require("./requestParser");

module.exports = (connection) => {
    const parser = new RequestParser()
    // 判断缓冲区是否有数据
    connection.on('data', (buffer) => {
        // 读取并解析数据
        parser.append(buffer)
    })


    // Request 是否完毕
    parser.on('finish', () => {
        // plugin 0
        // ...
        // make response
        
        // connection.end(response)
    })
}
