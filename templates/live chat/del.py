import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('databases\chat_history.db')

# Create a cursor object
c = conn.cursor()

# Add a new column to the table with a default value of NULL
c.execute("ALTER TABLE chat_history ADD COLUMN agent TEXT DEFAULT NULL")

# Commit the transaction
conn.commit()

# Close the connection
conn.close()
