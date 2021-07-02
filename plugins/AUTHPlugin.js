const utils = require("../utils");
const path = require("path");
const fs = require("fs");
module.exports = function (message, env) {
    const {session} = env
    const {request, response} = message

    if (response.status) return message

    const [authorization, cookie] = utils.getHeaders(request.headers, "Authorization", "Cookie")
    if (authorization) {
        // 走初始认证逻辑
        return checkAuthorization(message, session, authorization)
    } else {
        // 检查cookie
        return checkCookie(message, session, cookie)
    }
}

function checkCookie(message, session, cookie) {
    const {response} = message
    if (cookie) {
        const sessionID = cookie.match(/sessionid=(session_\d+)/i)[1];
        const sessionExisted = path.resolve(session, sessionID)
        if (fs.existsSync(sessionExisted)) {
            if(fs.readFileSync(sessionExisted).toString() === 'admin'){
                return message
            }
        }
    }
    response.status = 401
    utils.setHeader(response.headers, 'WWW-Authenticate', 'Basic realm="login"');
    return message
}

function checkAuthorization(message, session, authData) {
    const {response} = message
    // 这里将用户名和密码设置为admin 00000
    // Basic base64(user:pass)
    const base64 = authData.match(/Basic\s*(\w+)/i)[1];
    if (base64) {
        const [username, password] = Buffer.from(base64, 'base64').toString().split(':');
        if (username === 'admin' && password === '000000') {
            // make session and set cookie
            const sessionID = 'session_' + new Date().getTime()
            const sessionPath = path.resolve(session, sessionID)
            fs.writeFileSync(sessionPath, username)
            utils.setHeader(response.headers, 'Set-Cookie', `sessionid=${sessionID};max-age=3600`)
        } else {
            response.status = 401
            utils.setHeader(response.headers, 'WWW-Authenticate', 'Basic realm="login"');
        }
    }
    return message
}

