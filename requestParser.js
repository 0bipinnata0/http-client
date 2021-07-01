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

    _read_head_line(char) {
    }

    _read_body(char) {

    }

    _send_finish_event(char) {
        // 完成之后触发events的时间通知
        this.emit('finish', this._message)
        return this.end(char)
    }

    _end(char) {
        return this._end
    }
}


module.exports = RequestParser
