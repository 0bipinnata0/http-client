const statusMap = {
    200: 'ok',
    201: 'Created',
    206: 'Partial Content', //服务器成功处理了部分GET请求，或者返回了请求资源的部分内容
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
}
/**
 * statusLine
 * HeaderLine
 * body
 */
module.exports = (message) => {
    if (!message.response.status) {
        message.response.status = 500
    }
    const reasonPhrase = statusMap[message.response.status]

    // HTTP版本 SP HTTP状态码 SP HTTP状态码说明
    const statusLine = `${message.request.version} ${message.response.status} ${reasonPhrase}\r\n`

    // body长度，Content-length
    message.response.headers.push({key: 'Content-length', value: message.response.body.length})

    // 转成字符串
    let headerLines = message.response.headers.map(item => `${item.key}: ${item.value}\r\n`).join('')

    // 添加换行符
    headerLines += '\r\n'

    // 转换成buffer流
    return Buffer.concat([
        Buffer.from(statusLine, 'ascii'),
        Buffer.from(headerLines, 'ascii'),
        message.response.body
    ])
}
