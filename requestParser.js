const Events = require("events");

class RequestParser extends Events {
    _state = this._read_request_line
    _message;

    append(buffer) {
        for (let offset = 0; offset < buffer.length; offset++) {
            this._state = this._state(buffer[offset])
        }
    }

    _read_request_line(char) {

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
