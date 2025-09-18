import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser"

export const socket = io('https://local.drizzle.studio', {
    parser
});