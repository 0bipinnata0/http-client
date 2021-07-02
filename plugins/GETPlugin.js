/**
 * get
 * path         不合法  403
 * path         不存在  404       fs.existsSync
 * path为目录    输出目录列表 200   fs.statSync   xx.isDirectory  fs.readdirSync
 * path为文件    文件存在 200       xx.isFile   fs.readFileSync
 *              不存在 404
 */
const path = require("path");
const fs = require("fs");
module.exports = function (message, env) {
    const {request, response} = message
    const {root} = env
    if (response.status) return message

    if (request.method !== 'GET') return message

    if (request.path.indexOf('.') === 0) {
        response.status = 403
        return message
    }

    const requestPath = path.resolve(root + request.path)

    if (!fs.existsSync(requestPath)) {
        response.status = 404
        return message
    }

    const requestPathStat = fs.statSync(requestPath)


    if (requestPathStat.isFile()) {
        response.status = 200
        response.body = fs.readFileSync(requestPath)
        return message
    } else if (requestPathStat.isDirectory()) {
        let dirs = fs.readdirSync(requestPath);
        let contentHTML = dirs.map(item => {
            const itemPath = path.resolve(requestPath, item)
            const itemStat = fs.statSync(itemPath)
            let size = '-'
            if (itemStat.isFile()) {
                size = itemStat.size
            }
            return `<tr><td>${item}</td><td>${itemStat.mtime}</td><td>${size}</td></tr>`
        }).join('')
        let template = `<!DOCTYPE html><html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
        </head>
        <body>
        <h1>index Of ${request.path}</h1>
        <hr/>
        <table>
            ${contentHTML}
        </table>
        <hr/>
        </body>
        </html>
        `
        response.status = 200
        response.body = Buffer.from(template, 'utf-8')
        return message
    }

    response.status = 403;
    return message

}
