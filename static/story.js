
document.addEventListener("DOMContentLoaded", () => {
    const data = window.storyData;
    const jpTextElem = document.getElementById("jp-text");
    const titleElem = document.getElementById("story-title");
    const romajiTitleElem = document.getElementById("story-title-romaji");

    // Set title with romaji
    if (titleElem && data.title) {
        titleElem.textContent = data.title;
    }
    if (romajiTitleElem && data.title_romaji) {
        romajiTitleElem.textContent = data.title_romaji;
    }

    // Safety check: ensure text exists before processing
    if (!data.text) return;

    // Logic to split and group sentences for Japanese text
    function getJapaneseSentences(text) {
        if (!text) return [];
        // Split by Japanese sentence endings
        const sentences = text.split(/([。！？]+)/).filter(s => s.trim() !== "");
        const grouped = [];
        for (let i = 0; i < sentences.length; i += 2) {
            if (sentences[i + 1]) {
                grouped.push(sentences[i] + sentences[i + 1]);
            } else {
                grouped.push(sentences[i]);
            }
        }
        return grouped;
    }

    // Logic to split and group sentences for Romaji text
    function getRomajiSentences(text) {
        if (!text) return [];
        // Split by Roman punctuation
        const sentences = text.split(/([.!?]+)/).filter(s => s.trim() !== "");
        const grouped = [];
        for (let i = 0; i < sentences.length; i += 2) {
            if (sentences[i + 1]) {
                grouped.push(sentences[i] + sentences[i + 1]);
            } else {
                grouped.push(sentences[i]);
            }
        }
        return grouped;
    }

    const jpSentences = getJapaneseSentences(data.text);
    const romajiSentences = getRomajiSentences(data.text_romaji || data.romaji || "");
    
    // Combine title and sentences into one timeline
    const allSegments = [data.title, ...jpSentences];

    const audio = new Audio(data.audioUrl);
    let currentSegmentIndex = 0;
    let timeoutId = null;
    let isPlaying = false;

    // Build the UI
    function initializeText() {
        jpTextElem.innerHTML = "";
        
        // If no romaji sentences or mismatch, create empty romaji lines
        const romajiArray = romajiSentences.length > 0 ? 
            romajiSentences : 
            Array(jpSentences.length).fill("");
        
        jpSentences.forEach((sentence, index) => {
            const container = document.createElement("div");
            // Add base classes
            container.className = "sentence-container p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200";
            container.id = `sentence-block-${index}`;
            
            // Click to play functionality (Optional feature enhancement)
            container.onclick = () => {
                // Future: Add logic to jump audio to this sentence here
                console.log("Clicked sentence:", index);
            };

            const jpLine = document.createElement("div");
            jpLine.textContent = sentence;
            jpLine.className = "text-xl font-medium text-gray-800 leading-loose mb-1";

            const romajiLine = document.createElement("div");
            // Use romaji if available, otherwise show placeholder
            romajiLine.textContent = romajiArray[index] || "";
            romajiLine.className = "text-sm text-gray-500 mt-1 italic font-light";
            
            // Hide romaji line if empty
            if (!romajiArray[index]) {
                romajiLine.style.display = 'none';
            }

            container.appendChild(jpLine);
            container.appendChild(romajiLine);
            jpTextElem.appendChild(container);
        });
    }

    // "Dead Reckoning" Timer - Calculates how long to wait before next highlight
    function calculateSegmentTime(text, playbackRate = 1.0) {
        const baseTimePerChar = 160; 
        let segmentTime = (text.length * baseTimePerChar) / playbackRate;
        // Adjust pauses: Longer for title
        segmentTime += (text === data.title) ? 1500 : 800; 
        return segmentTime;
    }

    function startHighlighting(playbackRate = 1.0) {
        if (isPlaying) return;
        isPlaying = true;
        currentSegmentIndex = 0;

        function highlightNextSegment() {
            if (!isPlaying) return;

            // 1. Clean up previous highlights
            titleElem.classList.remove("title-highlight");
            document.querySelectorAll(".sentence-container").forEach(el => {
                el.classList.remove("highlight-block");
            });

            // 2. Check if finished
            if (currentSegmentIndex >= allSegments.length) {
                isPlaying = false;
                return;
            }

            // 3. Highlight current target
            const currentText = allSegments[currentSegmentIndex];
            
            if (currentSegmentIndex === 0) {
                // Title
                titleElem.classList.add("title-highlight");
                // Also highlight romaji title if it exists
                if (romajiTitleElem) {
                    romajiTitleElem.classList.add("title-highlight");
                }
            } else {
                // Sentences (Index offset by 1 because title is 0)
                const blockIndex = currentSegmentIndex - 1;
                const block = document.getElementById(`sentence-block-${blockIndex}`);
                if (block) {
                    block.classList.add("highlight-block");
                    // Smooth scroll to keep current sentence in view
                    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            // 4. Schedule next
            const time = calculateSegmentTime(currentText, playbackRate);
            currentSegmentIndex++;
            timeoutId = setTimeout(highlightNextSegment, time);
        }

        highlightNextSegment();
    }

    function stopEverything() {
        isPlaying = false;
        clearTimeout(timeoutId);
        audio.pause();
        audio.currentTime = 0;
        
        // Clear all visual highlights immediately
        titleElem.classList.remove("title-highlight");
        if (romajiTitleElem) {
            romajiTitleElem.classList.remove("title-highlight");
        }
        document.querySelectorAll(".sentence-container").forEach(el => {
            el.classList.remove("highlight-block");
        });
    }

    // Audio Controls
    const playBtn = document.getElementById("play-normal");
    const slowBtn = document.getElementById("play-slow");
    const stopBtn = document.getElementById("stop");

    if(playBtn) playBtn.onclick = () => {
        stopEverything();
        audio.playbackRate = 1.0;
        audio.play().then(() => startHighlighting(1.0)).catch(e => console.error("Audio play failed", e));
    };

    if(slowBtn) slowBtn.onclick = () => {
        stopEverything();
        audio.playbackRate = 0.6;
        audio.play().then(() => startHighlighting(0.6));
    };

    if(stopBtn) stopBtn.onclick = stopEverything;

    audio.onended = stopEverything;
    
    // Initialize
    initializeText();
    // Re-init icons if you are using Lucide
    if(window.lucide) window.lucide.createIcons();
});
