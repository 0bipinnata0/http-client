import {Socket} from "net";
import RequestParser from "./requestParser";
import makeResponse from "./makeResponse";

export default (connection: Socket) => {
    const parser = new RequestParser()

    connection.on('data', (buffer) => {
        // 读取并解析数据
        parser.append(buffer)
    })

    parser.on('finish', (message) => {
        // 解析数据结束后结束请求
        connection.end(() => {
            // 处理模块
            // 生成响应
            return makeResponse(message)
        })
    })
}
