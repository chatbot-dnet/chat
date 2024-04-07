// Import necessary modules
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Initialize SQLite database
const db = new sqlite3.Database('databases/user.db');

// Sample data
const username = 'qwerty';
const password = 'password123';

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    // Insert the user into the database
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err) => {
        if (err) {
            console.error('Error inserting user into database:', err);
            return;
        }
        console.log('User inserted successfully');
    });
});
