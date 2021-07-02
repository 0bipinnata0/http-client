const path = require("path");
const fs = require("fs");
module.exports = function (message, env) {
    const {root} = env
    const {request, response} = message

    if (response.status) return message
    if (request.method !== 'PUT') return message

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

    if (!requestPathStat.isFile()) {
        response.status = 403
        return message
    }

    fs.writeFileSync(requestPath, request.body)
    response.status = 200
    return message
}
