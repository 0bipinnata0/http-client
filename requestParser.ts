// const Events = require("events");
import {EventEmitter} from "events";
import * as Buffer from "buffer";

interface RequestParseType{
    append(data:Buffer):void
}

class RequestParser extends EventEmitter implements RequestParseType{
    append(data: Buffer): void {
    }
}

export default RequestParser
