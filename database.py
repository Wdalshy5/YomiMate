import sqlite3
"""
database module
----------------
Provides a minimal SQLite-backed helper for an authentication database.
This module exposes a module-level DATABASE path and two functions:
- get_db(): open and return a sqlite3.Connection configured to return rows
    as sqlite3.Row objects.
- init_db(): create the 'users' table if it does not already exist, then
    commit and close the connection.
Comments / explanation of everything
-----------------------------------
- DATABASE (str)
    - A simple filename used by sqlite3.connect(). As written, this is a
        relative path ("auth.db") so the database file will be created in
        the current working directory of the process. To control location,
        replace this constant with an absolute path or make it configurable.
- get_db()
    - Purpose: open a connection to the SQLite database and configure the
        connection so queries return sqlite3.Row objects (mapping access by
        column name).
    - Return value: sqlite3.Connection
    - Behavior notes:
        - The returned connection must be closed by the caller (conn.close())
            or used as a context manager (with sqlite3.connect(...) as conn:).
        - sqlite3.connect() creates the database file if it does not exist.
        - By default, this connection uses SQLite's default isolation level;
            callers who need explicit transactions should manage conn.commit()
            and conn.rollback() as appropriate.
        - Threading: sqlite3 connections are not generally safe to share
            between threads. If your application is multi-threaded, create a
            separate connection per thread or enable check_same_thread=False
            with care.
- init_db()
    - Purpose: ensure the required schema for authentication exists by
        creating a 'users' table if it does not already exist.
    - Schema details (created table 'users'):
        - id INTEGER PRIMARY KEY AUTOINCREMENT
            - Unique numeric identifier for each user.
        - username TEXT UNIQUE NOT NULL
            - Human-readable login name; uniqueness enforced at DB level.
        - email TEXT UNIQUE NOT NULL
            - User email address; uniqueness enforced at DB level.
        - password_hash TEXT NOT NULL
            - Stored password hash (not plain text). Hashing and verification
                must be handled by application code (e.g., bcrypt, Argon2).
        - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            - Automatically records creation time using SQLite's CURRENT_TIMESTAMP.
    - Behavior:
        - Uses CREATE TABLE IF NOT EXISTS so calling init_db() multiple
            times is safe.
        - Commits the DDL and closes the connection prior to returning.
        - Errors: sqlite3.Error (and subclasses) may be raised on failure;
            callers can catch these to handle initialization problems.
Usage example (conceptual)
--------------------------
- Acquire a connection for normal queries:
        try:
                cur = conn.execute("SELECT * FROM users WHERE username = ?", (uname,))
                row = cur.fetchone()
                ...
        finally:
- Initialize the database schema once (e.g., at application startup):
        init_db()
Recommended improvements (consider for production)
-------------------------------------------------
- Make DATABASE configurable (environment variable, app config).
- Use connection context managers (with ...) or higher-level helpers to
    ensure connections are always closed.
- Use stronger type validation and migrations (e.g., Alembic) for schema
    evolution rather than ad-hoc CREATE TABLE statements.
- Do not store plaintext passwords. Use a secure password hashing library
    (bcrypt, Argon2) and store only the hash in password_hash.
- Consider connection pooling or an application-specific DB access layer
    if concurrency/performance becomes a requirement.
Exceptions and errors
---------------------
- This module delegates error reporting to sqlite3. Common exceptions:
    - sqlite3.OperationalError for file/permission issues or malformed SQL.
    - sqlite3.IntegrityError when UNIQUE constraints are violated on inserts.
    - sqlite3.DatabaseError and sqlite3.Error as generic bases.
Security note
-------------
- The module itself issues SQL only via a fixed CREATE TABLE statement,
    so SQL injection is not an issue here. However, when using the returned
    connections elsewhere in the application, always use parameterized
    queries (the "?" placeholder style) to avoid SQL injection risks.
"""

DATABASE = "auth.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()
