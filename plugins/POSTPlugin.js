const fs = require('fs')
const path = require("path");

/**
 * path === 0
 * method = POST
 * path 合法  -> 不合法 status = 403
 * path 是否存在
 * 不存在创建 status = 201  存在：status = 403
 * 返回 message
 */
module.exports = function (message, env) {
    const {root} = env
    if (message.response.status) return message
    if (message.request.method !== 'POST') return message
    if (message.request.path.indexOf('.') === 0) {
        message.request.method = '403'
        return message
    }
    const requestPath = path.resolve(root + message.request.path)
    console.log('path',requestPath)
    // 判断文件是否存在
    if (fs.existsSync(requestPath)) {
        message.response.status = '403'
        return message
    }

    message.response.status = '201'
    // 创建文件
    fs.mkdir(path.dirname(requestPath),()=>{})
    fs.writeFileSync(requestPath,message.request.body)
    return message
}
