import { createServer } from 'node:http';
import { createSubtitleWebSocketServer } from './src/lib/server/subtitleWebSocket.js';
import { pool } from './src/lib/db/mysqlNode.js';

const server = createServer();

createSubtitleWebSocketServer(server, pool);

server.listen(3015, '127.0.0.1', () => { console.log('WebSocket server running on ws://127.0.0.1:3015'); });