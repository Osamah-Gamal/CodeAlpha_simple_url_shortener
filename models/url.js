const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'urls.db');
const db = new sqlite3.Database(dbPath);

// create table urls in db
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_code TEXT UNIQUE NOT NULL,
            original_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `,
     (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
});

// shorten url by random... 6 chars...
function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// insert new url
function insertUrl(originalUrl, callback) {
    const shortCode = generateShortCode();
    
    db.run(
        'INSERT INTO urls (short_code, original_url) VALUES (?, ?)',
        [shortCode, originalUrl],
        function(err) {
            if (err) {  
                // Is it duplicate... 
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    insertUrl(originalUrl, callback);
                    return;
                }
                callback(err, null);
            } else {
                callback(null, { id: this.lastID, shortCode, originalUrl });
            }
        }
    );
}

// search ...
function findUrlByShortCode(shortCode, callback) {
    db.get(
        'SELECT * FROM urls WHERE short_code = ?',
        [shortCode],
        (err, row) => {
            callback(err, row);
        }
    );
}



// get all urls from table urls
function getAllUrls(callback) {
    db.all('SELECT * FROM urls ORDER BY created_at DESC', callback);
}


// في models/Url.js - أضف هذه الدالة
function searchUrls(searchTerm, callback) {
    db.all(
        `SELECT * FROM urls 
         WHERE original_url LIKE ? OR short_code LIKE ?
         ORDER BY created_at DESC`,
        [`%${searchTerm}%`, `%${searchTerm}%`],
        callback
    );
}

//  ...
module.exports = {
    insertUrl,
    findUrlByShortCode,
    getAllUrls,
    searchUrls  
};