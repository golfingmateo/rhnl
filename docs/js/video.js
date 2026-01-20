// Video page logic for Squarespace embed

// Configure these paths based on your Squarespace page URLs
const MAIN_PAGE_URL = 'index.html';   // Change to your Squarespace main page URL (e.g., '/sermons')
const SERIES_PAGE_URL = 'series.html'; // Change to your Squarespace series page URL (e.g., '/sermons/series')

async function initVideoPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    const title = urlParams.get('title');
    const thumbnail = urlParams.get('thumbnail');
    const description = urlParams.get('description');
    const seriesFilename = urlParams.get('series');
    const seriesTitle = urlParams.get('seriesTitle');

    if (!videoId) {
        console.error('No video ID provided');
        window.location.href = MAIN_PAGE_URL;
        return;
    }

    // Set page title
    document.querySelector("h1").textContent = title || 'Sermon';
    document.title = `Reality Honolulu | ${title || 'Sermon'}`;

    // Set the video iframe src and title
    const iframe = document.getElementById("sermon-video");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = title || 'Sermon Video';

    // Add Sermon description text
    const sermonDescription = document.getElementById("sermon-description");
    sermonDescription.innerHTML = `<p>${description || ''}</p>`;

    // Setup return button
    const returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        // If coming from a series, go back to that series page
        if (seriesFilename && seriesTitle) {
            const params = new URLSearchParams({
                filename: seriesFilename,
                title: seriesTitle
            });
            window.location.href = `${SERIES_PAGE_URL}?${params.toString()}`;
        } else {
            window.location.href = MAIN_PAGE_URL;
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Entry Point
document.addEventListener('DOMContentLoaded', function() {
    initVideoPage();
});
