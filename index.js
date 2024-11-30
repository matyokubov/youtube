// ==UserScript==
// @name         YouTube Enhancements (Seamless Loop + Remove Elements)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Enable seamless looping on YouTube videos and remove specific elements
// @author       Lorem Ipsum
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("YouTube Enhancements script initialized.");

    // Function to remove specific elements
    function removeTargetElements() {
        // Remove div#contents.style-scope.ytd-rich-grid-renderer
        document.querySelectorAll('div#contents.style-scope.ytd-rich-grid-renderer').forEach(element => {
            element.remove();
            console.log('Removed: div#contents.style-scope.ytd-rich-grid-renderer');
        });

        // Remove div with class="style-scope ytd-watch-flexy" and id="secondary"
        document.querySelectorAll('div.style-scope.ytd-watch-flexy#secondary').forEach(element => {
            element.remove();
            console.log('Removed: div.style-scope.ytd-watch-flexy#secondary');
        });

        // Remove div with partial class matching for the endscreen
        document.querySelectorAll('div[class*="html5-endscreen"][class*="ytp-player-content"]').forEach(element => {
            element.remove();
            console.log('Removed: div with html5-endscreen classes');
        });
    }

    // Function to enable seamless video looping
    function enableSeamlessLooping() {
        console.log("Activating seamless video looping...");

        try {
            const videos = document.querySelectorAll("video");
            videos.forEach(video => {
                // Force loop property
                video.loop = true;

                // Ensure the video plays again immediately when it ends
                video.addEventListener("ended", () => {
                    console.log("Video ended. Restarting seamlessly...");
                    video.currentTime = 0;
                    video.play();
                });

                // Disable endscreen and suggestions
                const player = video.closest('.html5-video-player');
                if (player) {
                    const endscreen = player.querySelector('.ytp-endscreen-content');
                    if (endscreen) {
                        endscreen.style.display = 'none';
                        console.log("Disabled endscreen content.");
                    }
                }
            });
        } catch (error) {
            console.error("Error in enableSeamlessLooping: ", error);
        }
    }

    // Function to disable autoplay suggestions
    function disableAutoplaySuggestions() {
        const autoplayButton = document.querySelector(".ytp-autonav-toggle-button");
        if (autoplayButton && autoplayButton.getAttribute("aria-checked") === "true") {
            autoplayButton.click(); // Turn off autoplay
            console.log("Autoplay suggestions disabled.");
        }
    }

    // Initial execution on page load
    window.addEventListener("load", () => {
        console.log("[Debug] Page loaded. Executing initial setup...");
        removeTargetElements();
        enableSeamlessLooping();
        disableAutoplaySuggestions();
    });

    // Monitor the page for dynamic content changes
    const observer = new MutationObserver(() => {
        console.log("[Debug] DOM mutation detected. Reapplying changes...");
        removeTargetElements();
        enableSeamlessLooping();
        disableAutoplaySuggestions();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("YouTube Enhancements script fully loaded.");
})();
