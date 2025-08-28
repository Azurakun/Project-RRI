import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Database Configuration ---
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'rri_jambi',
};

const pool = mysql.createPool(dbConfig);

// --- API Endpoints ---

// Database Status
app.get('/api/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules WHERE is_active = true ORDER BY waktu');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Organization Members
app.get('/api/organization-members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM organization_members WHERE is_active = true ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE is_active = true ORDER BY event_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Admin Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // This is a simplified login. In a real app, use bcrypt to compare hashed passwords.
  if (username === 'ADMIN' && password === 'ADMINRRI22') {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// --- Server ---
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});