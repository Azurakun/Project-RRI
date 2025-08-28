import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'rri_jambi',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to test the connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the MySQL database.');
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to the MySQL database:', error);
    return false;
  }
};

// Export the pool for executing queries
export default pool;