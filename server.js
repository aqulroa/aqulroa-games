const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

// Middleware
app.use(express.json());
app.use(session({
    secret: 'super-secret-key-for-watercolors',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        if (bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.prefix = user.prefix;
            req.session.color = user.color;
            req.session.glow = user.glow;
            return res.json({ success: true });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// API: Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// API: Get current user info
app.get('/api/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({
        username: req.session.username,
        prefix: req.session.prefix,
        color: req.session.color,
        glow: req.session.glow
    });
});

// Interceptor for HTML files
app.use((req, res, next) => {
    // Exclude API routes
    if (req.path.startsWith('/api/')) return next();

    const isHtmlReq = req.path.endsWith('.html') || req.path === '/';
    
    if (!req.session.userId) {
        // Not authenticated
        if (req.path === '/' || isHtmlReq) {
            // Serve watercolors page
            return res.sendFile(path.join(__dirname, 'watercolors.html'));
        }
        // Allow other static assets (images for watercolors, etc)
        return next();
    } else {
        // Authenticated
        if (isHtmlReq) {
            let filePath = req.path === '/' ? '/index.html' : req.path;
            const absolutePath = path.join(__dirname, filePath);
            
            // Special case for watercolors: if they explicitly ask for it, serve it normally
            if (req.path === '/watercolors.html') {
                return res.sendFile(absolutePath);
            }

            fs.readFile(absolutePath, 'utf8', (err, data) => {
                if (err) {
                    // If file not found, let static handler deal with it (which will return 404)
                    return next();
                }
                
                // Inject our overlay script before </body>
                const scriptTag = `\n<script src="/user-overlay.js"></script>\n</body>`;
                const modifiedHtml = data.replace('</body>', scriptTag);
                
                res.setHeader('Content-Type', 'text/html');
                return res.send(modifiedHtml);
            });
        } else {
            // Not HTML, just serve it normally
            next();
        }
    }
});

// Static files fallback
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server is running! Access it at http://localhost:${PORT}`);
});
