import mysql from 'mysql2/promise';
import { createServer } from 'node:http';
import { createSubtitleWebSocketServer } from './src/lib/server/subtitleWebSocket.js';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: process.env.DB_SOCKET || undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    dateStrings: true,
    timezone: 'Z'
});

const server = createServer();

createSubtitleWebSocketServer(server, pool);

server.listen(3015, '127.0.0.1', () => { console.log('WebSocket server running on ws://127.0.0.1:3015'); });