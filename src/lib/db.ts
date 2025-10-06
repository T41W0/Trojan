import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tegas_food',
  port: parseInt(process.env.DB_PORT || '3307'),
};

let connection: mysql.Connection | null = null;

export async function getConnection(): Promise<mysql.Connection> {
  try {
    if (!connection || connection.state === 'disconnected') {
      if (connection) {
        try {
          await connection.end();
        } catch (error) {
          console.log('Error closing old connection:', error);
        }
      }
      console.log('Creating new database connection...');
      connection = await mysql.createConnection(dbConfig);
      console.log('Database connection established');
    }
    return connection;
  } catch (error) {
    console.error('Error getting database connection:', error);
    // Force create a new connection
    connection = await mysql.createConnection(dbConfig);
    return connection;
  }
}

export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    // Try to reconnect and retry once
    try {
      connection = null; // Force reconnection
      const conn = await getConnection();
      const [rows] = await conn.execute(sql, params);
      return rows;
    } catch (retryError) {
      console.error('Database retry error:', retryError);
      throw retryError;
    }
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end();
    connection = null;
  }
}
