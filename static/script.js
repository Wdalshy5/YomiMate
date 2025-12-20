
$(document).ready(function () {

    function loadStories(level) {
        // Optional: show a loading state
        $("#story-list").html('<div class="col-span-full text-center py-10 text-gray-400">Loading stories...</div>');

        fetch(`/api/stories/${level}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(stories => {
                $("#story-list").empty();

                if (stories.length === 0) {
                    $("#story-list").append('<li class="col-span-full text-center py-10 text-gray-500">No stories available.</li>');
                    return;
                }

                // Sort stories in descending order by ID (highest ID first)
                const sortedStories = stories.sort((a, b) => {
                    // Ensure we have valid IDs, fallback to 0 if undefined
                    const idA = a.id !== undefined ? a.id : 0;
                    const idB = b.id !== undefined ? b.id : 0;
                    return idA-idB; // Ascending order
                });

                // Display the sorted stories
                sortedStories.forEach((story, index) => {
                    // Get the story ID from the sorted data
                    const storyId = story.id !== undefined ? story.id : sortedStories.length - index;
                    const storyNumber = storyId.toString().padStart(2, '0'); // Format as 01, 02, etc.
                    
                    const storyItem = $(`
                        <li class="story-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:border-[#f7931e] transition-colors">
                            <div class="flex flex-col items-center min-w-[70px]">
                                <span class="text-5xl font-black text-[#f7931e] opacity-80">${storyNumber}</span>
                                <span class="text-xs font-semibold text-gray-400 mt-1">${level.toUpperCase()}</span>
                            </div>
                            
                            <div class="flex flex-col overflow-hidden">
                                <a href="/story/${level}/${storyId}" class="text-xl font-bold text-[#1d4e89] truncate">
                                    ${story.title}
                                </a>
                                <div class="flex items-center gap-2 mt-1">
                                    <p class="text-gray-400 text-sm font-medium">ID: ${storyId}</p>
                                    <span class="text-gray-300">•</span>
                                    <p class="text-gray-400 text-sm font-medium">Level: ${level.toUpperCase()}</p>
                                </div>
                            </div>
                        </li>
                    `);
                    $("#story-list").append(storyItem);
                });
            })
            .catch(error => {
                console.error("Error loading stories:", error);
                $("#story-list").html('<li class="col-span-full text-center py-10 text-red-500">Failed to load stories.</li>');
            });
            
    }

    // Tab Switching Logic
    $(".level-btn").click(function () {
        $(".level-btn").removeClass("active-tab text-white").addClass("text-gray-500");
        $(this).addClass("active-tab").removeClass("text-gray-500");
        
        const level = $(this).data("level");
        loadStories(level);
    });

    // Load N5 stories by default
    loadStories("n5");
});
