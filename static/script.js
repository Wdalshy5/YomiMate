$(document).ready(function () {

    // Function to load stories of a specific level
    function loadStories(level) {
        fetch(`/api/stories/${level}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(stories => {
                $("#story-list").empty();

                if (stories.length === 0) {
                    $("#story-list").append('<li class="text-gray-500">No stories available.</li>');
                    return;
                }

                stories.forEach((story, index) => {
                    const storyItem = $(`
                        <li class="story-card mb-3 p-4 rounded shadow hover:shadow-lg transition">
                            <a href="/story/${level}/${index}" class="story-title text-blue-700">
                                ${story.title}
                            </a>
                            <div class="story-level text-sm text-gray-500">
                                Level: ${level.toUpperCase()}
                            </div>
                        </li>
                    `);
                    $("#story-list").append(storyItem);
                });
            })
            .catch(error => {
                console.error("Error loading stories:", error);
                $("#story-list").html('<li class="text-red-500">Failed to load stories. Please try again.</li>');
            });
    }

    // Button click handlers
    $(".level-btn").click(function () {
        const level = $(this).data("level");
        loadStories(level);
    });

    // Optionally, load N5 by default on page load
    loadStories("n5");
});
