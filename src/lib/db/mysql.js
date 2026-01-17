import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SOCKET } from "$env/static/private";
import mysql from 'mysql2/promise';

// Validate environment variables
/* if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Database environment variables are not properly configured');
} */

// Create a connection pool
export const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    socketPath: DB_SOCKET || undefined, // Optional socketPath
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    timezone: 'Z'
});

// Test the connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Gracefully exit the process
    }
})();

// Optional: Debugging active connections (for development only)
if (process.env.NODE_ENV === 'development') {
    setInterval(async () => {
        const [rows] = await pool.query('SHOW STATUS LIKE "Threads_connected"');
        console.log('Active connections:', rows[0]?.Value || 0);
    }, 10000); // Log every 10 seconds
}
