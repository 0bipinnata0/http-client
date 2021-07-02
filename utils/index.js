function getHeaders(headers, ...keys) {
    return keys.map(key => {
        const target = findHeader(headers, key)
        if (!target) return null
        // 头部略去空格
        return target.value.trim()
    })
}

function getHeader(headers, key) {
    const target = findHeader(headers, key)
    if (!target) return null
    // 头部略去空格
    return target.value.trim()
}

function findHeader(headers, key) {
    return headers.find(header => header.key === key)
}

function setHeader(headers, key, value) {
    const target = findHeader(headers, key)
    if (target) {
        // 修改数据
        target[key] = value
    } else {
        // 新增数据
        headers.push({key, value})
    }
}

module.exports = {
    getHeaders,
    getHeader,
    setHeader
}
