// const Events = require("events");
import {EventEmitter} from "events";
import * as Buffer from "buffer";

type StateTypes = ReadRequestLine


interface RequestParseType {
    _state: StateTypes
    _cache: CacheType
    _message: RequestParam

    append(buffer: Buffer): void
    _read_request_line(char: number): StateTypes
}

// 第一类
type ReadRequestLine = (char: number) => StateTypes
type RequestLineCache = [number, string, string, string, boolean]
type RequestParam = { request: { method: string; path: string; version: string } }

type CacheType = RequestLineCache | null

class RequestParser extends EventEmitter implements RequestParseType {
    _state: StateTypes = this._read_request_line
    _cache: CacheType = null;
    _message: RequestParam = {
        request: {
            method: '',
            path: '',
            version: ''
        }
    };

    append(buffer: Buffer) {
        for (let offset = 0; offset < buffer.length; offset++) {
            this._state = this._state(buffer[offset]);
        }
    }

    _read_request_line(char: number) {
        if (!this._cache) {
            // Method, URI, Version, CR LF
            // [pointer, Method, URI, Version, CRFlage]
            this._cache = [1, '', '', '', false];
        }

        if (char === 0x20) { // === SP
            this._cache[0]++;
        } else if (char === 0x0D) { // === CR
            this._cache[4] = true;
        } else if (char === 0x0A && this._cache[4]) { // === LF
            this._message.request.method = this._cache[1];
            this._message.request.path = this._cache[2];
            this._message.request.version = this._cache[3];
            this._cache = null;
            // return this._read_header_line;
        } else {
            this._cache[this._cache[0]] += String.fromCharCode(char);
        }

        return this._read_request_line;
    }


}

export default RequestParser
