const fs = require("fs");
const path = require("path");
module.exports = function (message, env) {
    const {root} = env
    const {request, response} = message
    if (response.status) return message
    if (request.method !== 'DELETE') return message
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

    fs.unlinkSync(requestPath)
    response.status = 200
    return message

}
