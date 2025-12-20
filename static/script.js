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

                stories.forEach((story, index) => {
                    const storyItem = $(`
                        <li class="story-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:border-[#f7931e] transition-colors">
                            <span class="text-5xl font-black text-[#f7931e] opacity-80 min-w-[70px]">${level.toUpperCase()}</span>
                            
                            <div class="flex flex-col overflow-hidden">
                                <a href="/story/${level}/${index-1}" class="text-xl font-bold text-[#1d4e89] truncate">
                                    ${story.title}
                                </a>
                                <p class="text-gray-400 text-sm font-medium">Level: ${level.toUpperCase()}</p>
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

    loadStories("n5");
});
