import os
import json
from flask import Flask, render_template,request, jsonify
from model import create_user, get_user_by_username, check_password 
from database import init_db

app = Flask(__name__)

from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

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
        return jsonify({"error": str(e)}), 400


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


@app.route("/auth")
def home():
    return render_template("auth.html")

if __name__ == "__main__":
    app.run(debug=True)
