from flask import Flask, render_template, request, redirect, jsonify, session
import sqlite3
from chat import get_response
import json
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime
import flask
from flask import Flask, redirect, render_template, request, url_for, flash, jsonify
import torch
from torch.utils.data import DataLoader, TensorDataset
from tqdm import tqdm
import json
import torch.nn as nn
import random
from nltk_utils import tokenize  # Assuming tokenize function is defined in nltk_utils
import sqlite3


app = Flask(__name__)

# Load intents from intents.json
with open('intents.json', 'r', encoding='utf-8') as json_data:
    intents = json.load(json_data)

# Initialize an empty list to hold all words
all_words = []

# Iterate through intents and extract words from patterns
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenize each pattern and add unique words to all_words
        words = tokenize(pattern)
        all_words.extend(words)

# Remove duplicates by converting to set and back to list
all_words = list(set(all_words))

# Ensure all_words is sorted alphabetically for consistency
all_words.sort()



# Prepare your dataset (you need to replace these placeholders with your actual dataset)
# train_inputs, train_labels, val_inputs, val_labels, test_inputs, test_labels = ...

app.secret_key = 'Tp(2<a,(kw~[!cin6~E#fsKPf>Z6&NT%'

conn = sqlite3.connect('templates/live chat/databases/chat.db', check_same_thread=False)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS chat_history
             (username TEXT, problem TEXT, timestamp TEXT,agent TEXT DEFAULT NULL)''')
conn.commit()

conn = sqlite3.connect('templates/live chat/databases/chat.db', check_same_thread=False)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users
             (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)''')
conn.commit()

@app.route('/live')
def live():
    return redirect("http://localhost:3000/user_chat", code=302)

@app.route('/')
def index():
    return render_template('user_login.html')

@app.get("/base")
def index_get():
    return render_template("base.html")

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.post("/submit")  # Define route to handle form submission
def submit():
    if 'username' in session:  # Check if user is logged in
        username = session['username']
        problem = request.json.get('problem')  # Get problem from request JSON
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Get current timestamp
        conn = sqlite3.connect('templates/live chat/databases/chat.db')
        c = conn.cursor()
        c.execute("INSERT INTO chat_history (username, problem, timestamp) VALUES (?, ?, ?)",
                  (username, problem, timestamp))
        conn.commit()
        conn.close()
        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False, 'error': 'User not logged in'}), 401

@app.route('/user_login', methods=['POST'])
def user_login():
    username = request.form['username']
    password = request.form['password']
    conn = sqlite3.connect('templates/live chat/databases/chat.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    if user and checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        session['username'] = username
        return redirect('/base')
    else:
        return 'Invalid username or password'
    
@app.route("/predict", methods=["POST"])
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)


if __name__ == "__main__":
    app.run(debug=True)
