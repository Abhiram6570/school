const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Initialize database with better error handling
async function initDatabase() {
    let retries = 5;
    while (retries > 0) {
        try {
            console.log('Initializing database... Attempt:', 6 - retries);
            
            // Create users table
            await db.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            `);
            
            console.log('Table created/verified');
            
            // Insert default admin user if not exists
            try {
                const [existing] = await db.query('SELECT * FROM users WHERE username = "admin"');
                if (existing.length === 0) {
                    await db.query(
                        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                        ['admin', 'admin123', 'admin@school.com']
                    );
                    console.log('Default admin user created');
                } else {
                    console.log('Admin user already exists');
                }
            } catch (insertError) {
                console.log('Admin user may already exist:', insertError.message);
            }
            
            console.log('Database initialized successfully');
            break;
        } catch (error) {
            console.error('Database init error:', error.message);
            retries--;
            if (retries > 0) {
                console.log('Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('Failed to initialize database after retries');
            }
        }
    }
}

// Initialize database
initDatabase();

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

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
        console.error('DB Test Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

// Simple test login (works without database)
app.post('/api/test-login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Test login successful',
            user: { username: 'admin', email: 'admin@school.com' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Login endpoint with better error handling
app.post('/api/login', async (req, res) => {
    console.log('Login request received:', req.body);
    
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        console.log('Querying database for user:', username);
        const [users] = await db.query(
            'SELECT id, username, email FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        console.log('Query result:', users);
        
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
        console.error('Login error details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
            code: error.code
        });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
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
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('School Login API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME
    });
});
