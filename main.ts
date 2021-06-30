import worker from "./worker";
import {Socket} from "net";
import * as net from "net";

net.createServer((connection:Socket) => {
    worker(connection);
}).listen(80)
