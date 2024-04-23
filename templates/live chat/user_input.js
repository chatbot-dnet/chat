const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Initialize SQLite database
const db = new sqlite3.Database('databases/chat.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter username: ', (username) => {
  rl.question('Enter password: ', (password) => {
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        rl.close();
        return;
      }

      // Insert the user into the database
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err) => {
        if (err) {
          if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
            console.error('Username already exists. Please choose a different username.');
          } else {
            console.error('Error inserting user into database:', err);
          }
          rl.close();
          return;
        }
        console.log('User inserted successfully');
        rl.close();
      });
    });
  });
});