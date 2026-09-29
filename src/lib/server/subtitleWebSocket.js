import { WebSocketServer } from 'ws';

const rooms = new Map();

function joinRoom(socket, eventId) {
    const roomId = String(eventId);

    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(socket);
    socket.eventId = roomId;
}

function leaveRoom(socket) {
    if (!socket.eventId) return;

    const room = rooms.get(socket.eventId);
    if (room) {
        room.delete(socket);
        if (room.size === 0) rooms.delete(socket.eventId);
    }
    socket.eventId = null;
}

function broadcastToRoom(eventId, message, sender) {
    const room = rooms.get(String(eventId));
    if (!room) return;

    const data = JSON.stringify(message);
    for (const client of room) {
        if (client === sender) continue;
        if (client.readyState === client.OPEN) client.send(data);
    }
}

function getSessionUser(request) {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) return null;

    const cookies = {};

    for (const cookie of cookieHeader.split(';')) {
        const index = cookie.indexOf('=');

        if (index === -1) continue;

        const name = cookie.slice(0, index).trim();
        const value = cookie.slice(index + 1).trim();

        try { cookies[name] = decodeURIComponent(value); }
        catch { return null; }
    }

    if (!cookies.session) return null;

    try { return JSON.parse(cookies.session); }
    catch { return null; }
}

async function authorizeOperator(pool, userId, eventId) {
    const [rows] = await pool.query(`
        SELECT 1 FROM user_event
        WHERE id_event = ? AND id_user = ? AND id_role = ?
        LIMIT 1`,
        [eventId, userId, process.env.PUBLIC_ROLE_SUBTITLES_ID]
    );

    return rows.length > 0;
}

export function createSubtitleWebSocketServer(server, pool) {
    const wss = new WebSocketServer({ server, path: '/ws/subtitles' });

    wss.on('connection', (socket, request) => {
        console.log('Subtitle WebSocket connected');

        socket.role = null;
        socket.userId = null;
        socket.eventId = null;

        socket.on('message', async data => {
            let message;

            try { message = JSON.parse(data.toString()); }
            catch {
                console.log('Invalid WebSocket message');
                return;
            }

            if (message.type === 'operator') {
                await handleOperator(socket, request, message);
                return;
            }

            if (message.type === 'viewer') {
                handleViewer(socket, message);
                return;
            }

            if (message.type === 'activate') {
                handleActivate(socket, message);
                return;
            }
        });

        socket.on('close', () => {
            leaveRoom(socket);
            console.log(`Subtitle WebSocket disconnected` + `${socket.userId ? ` (user ${socket.userId})` : ''}`);
        });

        socket.on('error', () => { leaveRoom(socket); });
    });

    async function handleOperator(socket, request, message) {
        if (socket.role) {
            socket.close(1008, 'Already subscribed');
            return;
        }

        if (!message.eventId) {
            socket.close(1008, 'Missing event ID');
            return;
        }

        const user = getSessionUser(request);

        if (!user) {
            console.log('WebSocket operator rejected: no session');
            socket.close(1008, 'Not authenticated');
            return;
        }

        if (!user.id) {
            socket.close(1008, 'Invalid session');
            return;
        }

        try {
            const authorized = await authorizeOperator(pool, user.id, message.eventId);

            if (!authorized) {
                console.log(`User ${user.id} is not allowed to operate event ${message.eventId}`);
                socket.close(1008, 'Not authorized for this event');
                return;
            }

            socket.role = 'operator';
            socket.userId = user.id;

            joinRoom(socket, message.eventId);

            console.log(`Operator ${socket.userId} joined event ${socket.eventId}`);
        } catch (error) {
            console.error('Error validating subtitle operator:', error);
            socket.close(1011, 'Internal server error');
        }
    }

    function handleViewer(socket, message) {
        if (socket.role) {
            socket.close(1008, 'Already subscribed');
            return;
        }

        if (!message.eventId) {
            socket.close(1008, 'Missing event ID');
            return;
        }

        socket.role = 'viewer';
        joinRoom(socket, message.eventId);
        console.log(`Viewer joined event ${socket.eventId}`);
    }

    function handleActivate(socket, message) {
        if (socket.role !== 'operator') {
            console.log('Rejected activate from non-operator socket');
            return;
        }

        if (!Number.isInteger(message.line)) return;

        broadcastToRoom(
            socket.eventId,
            { type: 'activate', line: message.line },
            socket
        );

        console.log(
            `Operator ${socket.userId}: ` +
            `event ${socket.eventId}, ` +
            `line ${message.line}`
        );
    }

    return wss;
}