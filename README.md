

YomiMate - Japanese Reading Practice 📖🇯🇵

YomiMate is a web application designed to help learners practice reading Japanese stories with varying difficulty levels (N4-N5). The app features more than 50 stories, each with a dynamic voice reading feature (normal and slow speeds), and a line-highlighting feature to help users follow along with the reading.

#Features 🌟

50+ Stories 📚: A diverse collection of Japanese stories designed for N4-N5 learners.

Voice Reading 🎤: Stories are read aloud with the option to switch between normal and slow speeds to match the learner's pace.

Line Highlighting ✨: As the story is read, the current line is highlighted to help users stay on track.

Multiple Difficulty Levels 🔢: Stories are categorized by difficulty (N4-N5), providing an ideal learning experience for intermediate Japanese learners.

Interactive Interface 🖱️: Easy-to-use interface with simple navigation and controls.

Responsive Design 📱💻: Built with responsiveness in mind, ensuring a smooth experience on both mobile and desktop devices.


#Tech Stack 🛠️

Flask: A lightweight Python framework used to build the backend API and handle routing.

Tailwind CSS (CDN): Used for styling the app's frontend, providing a clean and responsive design.

jQuery: Used for handling DOM manipulation and AJAX requests.

JSON: Data storage format for managing stories and configurations.

Supabase: Provides the backend database for storing stories, user preferences, and settings.


#Installation 🏗️

To get started with YomiMate on your local machine, follow these steps:

1. Clone the Repository

git clone https://github.com/wdalshy5/YomiMate.git
cd YomiMate

2. Set up a Virtual Environment

python -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate  # For Windows

3. Install Dependencies

pip install -r requirements.txt

4. Set Up Supabase

Create a Supabase account at supabase.io.

Create a new project and configure your database.

Set up the SUPABASE_URL and SUPABASE_KEY in your app's configuration (typically in a .env file).


5. Run the Application

flask run

Visit http://localhost:5000 in your browser to start using the app!

Usage 🖥️

Story Selection 📜: Choose from the available stories based on your preferred difficulty level (N4 or N5).

Voice Controls 🎧: Use the controls to start or stop the voice reading and adjust the speed (normal or slow).

Highlighting 🔴: As the voice reads, the current line of text will be highlighted for easy tracking.


#Contributing 🤝

We welcome contributions! If you'd like to improve the app or add new features, feel free to fork the repository and submit a pull request.

How to Contribute:

1. Fork the repository.


2. Create a new branch (git checkout -b feature-branch).


3. Make your changes and commit them (git commit -am 'Add new feature').


4. Push to the branch (git push origin feature-branch).


5. Submit a pull request.



#License 📜

This project is licensed under the MIT License - see the LICENSE file for details.

#Contact 📬

If you have any questions or suggestions, feel free to open an issue or reach out to wdalsh5913@gmail.com
