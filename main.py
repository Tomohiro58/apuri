import sqlite3

conn = sqlite3.connect("soccer_app.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT
)
""")

conn.commit()
conn.close()