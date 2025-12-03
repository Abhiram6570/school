const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ 
            success: true, 
            message: 'Database connected successfully',
            data: rows 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // In a real app, you should use bcrypt to compare hashed passwords
        // For simplicity, we're doing direct comparison (not recommended for production)
        const [users] = await db.query(
            'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        if (users.length > 0) {
            res.json({
                success: true,
                message: 'Login successful',
                user: users[0]
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Simple register endpoint (for testing)
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, password, email]
        );
        
        res.json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('School Login API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});