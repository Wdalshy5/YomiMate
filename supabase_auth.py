# supabase_auth.py
from supabase import create_client

SUPABASE_URL = "https://hlxeqduxbyvxnsgubgeb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseGVxZHV4Ynl2eG5zZ3ViZ2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjgwMzIsImV4cCI6MjA4MDI0NDAzMn0.EpCSiaTpCDTYuoP2l3eKccZvxx5cNM33DNlyXBZTI9w"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def sign_up_user(email, password):
    """Sign up a new user"""
    user, error = supabase.auth.sign_up({
        "email": email,
        "password": password
    })
    return user, error

def sign_in_user(email, password):
    """Sign in an existing user"""
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })
    return response.get("data"), response.get("error")

def sign_out_user():
    """Sign out the current user"""
    response = supabase.auth.sign_out()
    return response
