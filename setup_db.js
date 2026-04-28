const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbFile = 'users.db';

// Remove existing db if you want to recreate it from scratch
if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
}

const db = new sqlite3.Database(dbFile);

const users = [
    { username: 'yarix', prefix: 'ZXC', color: '#ff003c', glow: '0 0 10px #ff003c, 0 0 20px #ff003c' },
    { username: 'egorchik', prefix: 'ZXC', color: '#ff003c', glow: '0 0 10px #ff003c, 0 0 20px #ff003c' },
    { username: 'kirill', prefix: 'mini-BOSS', color: '#ff8a00', glow: '0 0 10px #ff8a00, 0 0 20px #ff8a00' },
    { username: 'aqulroa', prefix: 'BOSS', color: '#b000ff', glow: '0 0 10px #b000ff, 0 0 20px #b000ff' },
    { username: 'egorvps', prefix: 'Pudge', color: '#00ff41', glow: '0 0 10px #00ff41, 0 0 20px #00ff41' },
    { username: 'misha', prefix: 'pronBOSS', color: '#ff00e6', glow: '0 0 10px #ff00e6, 0 0 20px #ff00e6' },
    { username: 'andrew', prefix: 'xentBOSS', color: '#00d0ff', glow: '0 0 10px #00d0ff, 0 0 20px #00d0ff' },
    { username: 'erdem', prefix: 'parkour', color: '#00ffcc', glow: '0 0 10px #00ffcc, 0 0 20px #00ffcc' },
    { username: 'gosha', prefix: 'parkour', color: '#00ffcc', glow: '0 0 10px #00ffcc, 0 0 20px #00ffcc' },
    { username: 'egorbul', prefix: 'iphone', color: '#ffe600', glow: '0 0 10px #ffe600, 0 0 20px #ffe600' },
    { username: 'dimas', prefix: 'prohacker', color: '#0f0', glow: '0 0 10px #0f0, 0 0 20px #0f0' },
    { username: 'danil', prefix: 'shrek', color: '#8b9c14', glow: '0 0 10px #8b9c14, 0 0 20px #8b9c14' },
    { username: 'valera', prefix: 'ozonBOSS', color: '#005bff', glow: '0 0 10px #005bff, 0 0 20px #005bff' },
    { username: 'bayas', prefix: 'РФ', color: '#ffffff', glow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #0039a6, 0 0 40px #d52b1e' },
    { username: 'vladik', prefix: 'pikmi', color: '#ff00aa', glow: '0 0 10px #ff00aa, 0 0 20px #ff00aa' },
    { username: 'slava', prefix: 'mega-alkash', color: '#ffd700', glow: '0 0 10px #ffd700, 0 0 20px #ffd700' }
];

const password = 'qwerty';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        prefix TEXT,
        color TEXT,
        glow TEXT
    )`);

    const stmt = db.prepare(`INSERT INTO users (username, password, prefix, color, glow) VALUES (?, ?, ?, ?, ?)`);
    
    users.forEach(user => {
        stmt.run(user.username, hash, user.prefix, user.color, user.glow);
    });

    stmt.finalize();
});

db.close(() => {
    console.log('Database initialized successfully with users.');
});
