import { createServer } from 'node:http';
import { handler } from './build/handler.js';
import { createSubtitleWebSocketServer } from './src/lib/server/subtitleWebSocket.js';
import { pool } from './src/lib/db/mysqlNode.js';

const server = createServer(handler);

createSubtitleWebSocketServer(server, pool);

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3014);

server.listen(port, host, () => { console.log(`Server running on http://${host}:${port}`); });