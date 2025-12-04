from database import get_db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_user(username, email, password):
    conn = get_db()
    cursor = conn.cursor()

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    cursor.execute("""
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
    """, (username, email, password_hash))

    conn.commit()
    conn.close()

def get_user_by_username(username):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    conn.close()
    return user

def check_password(user, password):
    return bcrypt.check_password_hash(user["password_hash"], password)
