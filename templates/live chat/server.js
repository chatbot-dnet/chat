const express = require('express');
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const http = require('http');

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = require("socket.io")(server);

const db = new sqlite3.Database('databases/chat.db');

let userCountUserChat = 0; // Initialize user count for users accessing /user_chat route

// Create a users table in the SQLite database
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS agents (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// Initialize express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
function fetchData() {
    return new Promise((resolve, reject) => {
        const query = "SELECT username, problem FROM chat_history WHERE status = 'open' AND live_chat = 1";

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

app.get('/plant-data', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve the user chat page
app.get('/user_chat', (req, res) => {
    userCountUserChat++; // Increment user count for users accessing /user_chat route
    console.log('Total users connected to user chat:', userCountUserChat);
    res.sendFile(path.join(__dirname, '/public/user_chat.html'));
});

// Serve the login page
app.get('/agent_login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/agent_login.html'));
});

// Handle login form submission
app.post('/agent_login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the username exists in the database
    db.get("SELECT * FROM agents WHERE username = ?", [username], (err, row) => {
        if (err || !row) {
            return res.redirect('/agent_login?error=Invalid%20username%20or%20password');
        }

        // Compare the provided password with the stored hash
        bcrypt.compare(password, row.password, (err, result) => {
            if (err || !result) {
                return res.redirect('/agent_login?error=Invalid%20username%20or%20password');
            }

            // Set user session upon successful login
            req.session.user = username;

            // If authentication is successful, redirect to the dashboard
            res.redirect('/agent_dash');
        });
    });
});


// Handle AJAX request for redirecting to agent chat
app.get('/redirect_to_agent_chat', (req, res) => {
    // Redirect to agent chat page
    res.redirect('/agent_chat');
});

// Serve the agent dashboard only if authenticated
app.get('/agent_chat', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
        return res.redirect('/agent_login');
    }
    res.sendFile(path.join(__dirname, '/public/agent_chat.html'));
});

app.get('/agent_dash', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
        return res.redirect('/agent_login');
    }
    res.sendFile(path.join(__dirname, '/public/agent_dash.html'));
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('Total users connected to user chat io :', userCountUserChat, socket.id);
    io.emit('userChatCount', userCountUserChat);
    // Handle incoming messages
    socket.on('newuser', (username) => {
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    socket.on('exituser', (username) => {
        socket.broadcast.emit("update", username + " left the conversation");
    });

    socket.on('chat', (message) => {
        socket.broadcast.emit("chat", message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        userCountUserChat--; // Decrement user count for users accessing /user_chat route
        console.log('Total users connected to user chat:', userCountUserChat);
        io.emit('userChatCount', userCountUserChat);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/user_chat');
});
