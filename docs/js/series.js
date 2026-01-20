// Series page logic for Squarespace embed

const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/data/';
const API_PLAYLIST = API_BASE_URL + 'playlists/';

// Configure these paths based on your Squarespace page URLs
const MAIN_PAGE_URL = 'index.html';  // Change to your Squarespace main page URL (e.g., '/sermons')
const VIDEO_PAGE_URL = 'video.html'; // Change to your Squarespace video page URL (e.g., '/sermons/watch')

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error){
        console.error('Error fetching data:', error);
    }
}

async function addSermonThumbnail(sermon, container, seriesFilename){
    const tmpl = document.getElementById("video-thumbnail-template")
    const clone = tmpl.content.cloneNode(true);
    clone.querySelector("img").src = sermon.thumbnail_url;
    clone.querySelector("img").alt = sermon.title;
    clone.querySelector(".thumbnail-title").textContent = sermon.title;
    const clickable = clone.querySelector(".thumbnail-container");

    // Build URL with parameters
    clickable.addEventListener("click", () => {
        const params = new URLSearchParams({
            videoId: sermon.video_id,
            title: sermon.title,
            thumbnail: sermon.thumbnail_url,
            description: sermon.description || '',
            series: seriesFilename
        });
        window.location.href = `${VIDEO_PAGE_URL}?${params.toString()}`;
    });

    container.appendChild(clone);
}

async function initSeriesPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filename = urlParams.get('filename');
    const title = urlParams.get('title');

    if (!filename) {
        console.error('No series filename provided');
        window.location.href = MAIN_PAGE_URL;
        return;
    }

    // Set page title
    document.querySelector("h1").textContent = title || 'Series';
    document.title = `Reality Honolulu | ${title || 'Series'}`;

    // Setup return button
    const returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = MAIN_PAGE_URL;
    });

    // Load and display sermons
    const container = document.getElementById("sermons-container");
    const sermons = await fetchJson(API_PLAYLIST + filename);

    if (sermons) {
        sermons.forEach(sermon => {
            addSermonThumbnail(sermon, container, filename);
        });
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Entry Point
document.addEventListener('DOMContentLoaded', function() {
    initSeriesPage();
});
