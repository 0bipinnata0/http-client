const Events = require("events");

class RequestParser extends Events {
    _state = this._read_request_line
    _message = {
        request: {
            method: '',
            path: '',
            version: '',
            headers: [],
            body: Buffer.from('')
        },
        response: {
            status: 0,
            headers: [],
            body: Buffer.from('')
        }
    };
    _cache;

    append(buffer) {
        for (let offset = 0; offset < buffer.length; offset++) {
            this._state = this._state(buffer[offset])
        }
    }

    /**
     * buffer流参照ASCII
     * Method SP Request-URI SP HTTP-Version CRLF
     * SP 20
     * CR 0D
     * LF 0A
     */
    _read_request_line(char) {
        // [point,method,URI,version,CRLF]
        let nextState = this._read_request_line
        if (!this._cache) {
            this._cache = [1, '', '', '', false]
        }
        if (char === 0x20) {
            this._cache[0]++
        } else if (char === 0x0D) {
            this._cache[4] = true
        } else if (char === 0x0A && this._cache[4]) {
            this._message.request.method = this._cache[1];
            this._message.request.path = this._cache[2];
            this._message.request.version = this._cache[3];

            // 状态切换前清空缓存
            this._cache = null;
            nextState = this._read_head_line
        } else {
            this._cache[this._cache[0]] += String.fromCharCode(char);
        }
        return nextState
    }

    /**
     * buffer流参照ASCII
     * token : content
     * : 3A
     * CR 0D
     * LF 0A
     */
    _read_head_line(char) {
        let nextState = this._read_head_line
        if (!this._cache) {
            // [pointer, token ,content, CRLF]
            this._cache = [1, '', '', false]
        }
        if (char === 0x3A) {
            this._cache[0]++
        } else if (char === 0x0D) {
            this._cache[3] = true
        } else if (char === 0x0A && this._cache[3]) {
            if (this._cache[1]) {
                this._message.request.headers.push({key: this._cache[1], value: this._cache[2]})
            } else {
                // token数组获取结束之后，应该是连续两个CRLF的情况，这个时候判断token是否为空，
                // 则可以判断是否切换到下一个状态机
                // 判断是否要读body
                // 如果有content-length，则读，否则，return end
                const {headers} = this._message.request
                const contentLengthHeader = headers.find(({key}) => key === 'Content-Length')
                if (contentLengthHeader && contentLengthHeader.value) {
                    nextState = this._read_body
                } else {
                    nextState = this._send_finish_event()
                }
            }
            this._cache = null
        } else {
            this._cache[this._cache[0]] += String.fromCharCode(char);
        }
        return nextState
    }

    _read_body(char) {
        let nextState = this._read_body
        const {headers} = this._message.request
        const {value: contentLength} = headers.find(({key}) => key === 'Content-Length')
        // Token: content CRLF
        // 字节需要提前指定长度
        // [content-length, bytes-read, content]
        if (!this._cache) {
            this._cache = [parseInt(contentLength), 0, new Uint8Array(contentLength)]
        }
        if(this._cache[1]<this._cache[0]){
            this._cache[2][this._cache[1]] = char
            this._cache[1]++
        }
        if(this._cache[0] === this._cache[1]){
            this._message.request.body= Buffer.from(this._cache[2])
            nextState = this._send_finish_event()
        }
        return nextState
    }

    _send_finish_event(char) {
        // 完成之后触发events的时间通知
        // 解析数据结束
        this.emit('finish', this._message)
        return this._end(char)
    }

    _end(char) {
        return this._end
    }
}


module.exports = RequestParser
