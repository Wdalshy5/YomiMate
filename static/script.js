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
    <li class="story-card bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
        
        <div class="h-40 w-full bg-gray-200">
            <img src="/static/images/${level.toUpperCase()}.png" 
     alt="${story.title}" 
     class="w-full h-full object-cover border-t border-gray-100">
        </div>

        <div class="p-4 flex flex-col flex-grow">
            <a href="/story/${level}/${index}" class="story-title text-blue-700 font-bold text-lg mb-2 hover:underline leading-tight">
                ${story.title}
            </a>

            <div class="story-level text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <span>Level: <span class="font-medium text-gray-700">${level.toUpperCase()}</span></span>
            </div>
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
