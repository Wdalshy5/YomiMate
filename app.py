import os
import json
from flask import Flask, render_template,request, jsonify,redirect
<<<<<<< HEAD
=======

>>>>>>> 42d7db2d253f3afcc1b9528768197db7c7d426f2
from model import create_user, get_user_by_username, check_password 
from database import get_db, init_db
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
app = Flask(__name__)

from flask_bcrypt import Bcrypt
  # redirect to /login if not logged in

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.secret_key = "something-very-secret-and-random"
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "/auth" 

class User(UserMixin):
    def __init__(self, row):
        self.id = row["id"]
        self.username = row["username"]

@login_manager.user_loader
def load_user(user_id):
    row = get_user_by_username(user_id)
    if row:
        return User(row)
    return None
  # return User object from DB

# Run once to create tables
init_db()

@app.route("/signup", methods=["POST"])
def register():
    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    try:
        create_user(username, email, password)
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = get_user_by_username(username)
    if user and check_password(user, password):
        login_user(UserMixin(user["id"]))
        return redirect("/dashboard")
    else:
        return jsonify({"error": "Invalid credentials"}), 401
def load_stories(level):
    folder = os.path.join("stories", level)
    stories = []

    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            path = os.path.join(folder, filename)
            with open(path, "r", encoding="utf-8") as f:
                stories.append(json.load(f))

    return stories

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/stories/<level>")
def get_stories(level):
    if level not in ["n4", "n5"]:
        return jsonify({"error": "Invalid level"}), 400
    return jsonify(load_stories(level))
@app.route("/story/<level>/<int:id>")
def story(level, id):
    # Make sure level is correct
    if level not in ["n4", "n5"]:
        return "Invalid level", 400

    # Load stories for that level
    folder = os.path.join("stories", level)
    stories = []
    for filename in sorted(os.listdir(folder)):
        if filename.endswith(".json"):
            path = os.path.join(folder, filename)
            with open(path, "r", encoding="utf-8") as f:
                stories.append(json.load(f))

    # Check if ID is valid
    if id < 0 or id >= len(stories):
        return "Story not found", 404

    # Pass the story object to template
    return render_template("story.html", story=stories[id], level=level, id=id)


@app.route("/dashboard")
@login_required
def dashboard():
    return "Welcome to your dashboard!"

@app.route("/auth")
def home():
    return render_template("auth.html")



if __name__ == "__main__":
    app.run(debug=True)
