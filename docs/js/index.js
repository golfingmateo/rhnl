// Main page logic for Squarespace embed

const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/data/';
const API_PLAYLIST = API_BASE_URL + 'playlists/';

// Configure these paths based on your Squarespace page URLs
const SERIES_PAGE_URL = 'series.html'; // Change to your Squarespace series page URL (e.g., '/sermons/series')
const VIDEO_PAGE_URL = 'video.html';   // Change to your Squarespace video page URL (e.g., '/sermons/watch')

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

function showLivestream(){
     // Get the current time in Hawaii
    const hawaiiTime = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Pacific/Honolulu" })
    );

    const day = hawaiiTime.getDay(); // 0 = Sunday
    const hours = hawaiiTime.getHours();
    const minutes = hawaiiTime.getMinutes();

     // Convert to minutes since midnight
    const currentTime = hours * 60 + minutes;
    const startTime = 10 * 60 + 30; // 10:30 AM
    const endTime = 12 * 60 + 30;   // 12:30 PM
    return (day === 0 && currentTime >= startTime && currentTime <= endTime);
}

async function addSermonThumbnail(sermon, container, seriesFilename = null){
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
            description: sermon.description || ''
        });
        if (seriesFilename) {
            params.append('series', seriesFilename);
        }
        window.location.href = `${VIDEO_PAGE_URL}?${params.toString()}`;
    });

    container.appendChild(clone);
}

async function populateRecentSermons(){
    const series = await fetchJson(API_BASE_URL + '/index.json');
    const most_recent = series.find(sermon => sermon.title === "Most Recent");
    if(!most_recent) {
        console.warn('No "Most Recent" series found.');
        return;
    }

    const container = document.getElementById("recent-sermons-container");
    const sermons = await fetchJson(API_PLAYLIST + most_recent.filename);
    sermons.forEach(sermon => {
        addSermonThumbnail(sermon, container, most_recent.filename);
    });
}

async function populateSeries(){
    const recent = document.getElementById("recent-series-container");
    const special = document.getElementById("special-series-container");
    const series = await fetchJson(API_BASE_URL + '/index.json');

    series.forEach(seriesItem => {
        if(seriesItem.title == "Most Recent") return; // Skip Most Recent

        const tmpl = document.getElementById("series-thumbnail-template")
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector("img").src = API_BASE_URL + seriesItem.thumbnail_url;
        clone.querySelector("img").alt = seriesItem.title;
        const clickable = clone.querySelector(".thumbnail-container");

        // Navigate to series page with URL parameters
        clickable.addEventListener("click", () => {
            const params = new URLSearchParams({
                filename: seriesItem.filename,
                title: seriesItem.title
            });
            window.location.href = `${SERIES_PAGE_URL}?${params.toString()}`;
        });

        // Append to the correct container
        if(seriesItem.category == "Special Series"){
            special.appendChild(clone);
        }else{
            recent.appendChild(clone);
        }
    });
}

async function initMainPage() {
    const main = document.getElementById("main");

    // Setup livestream section
    const live = document.getElementById("livestream-section-template").cloneNode(true);
    main.appendChild(live.content);
    if(showLivestream()){
        const container = document.getElementById("livestream-container");
        const tmpl = document.getElementById("active_livestream-template");
        const clone = tmpl.content.cloneNode(true);
        container.appendChild(clone);
        document.getElementById("placeholder").hidden = true;
    }

    // Setup recent sermons section
    const recentSermons = document.getElementById("recent-sermons-template").content.cloneNode(true);
    main.appendChild(recentSermons);
    populateRecentSermons();

    // Setup series sections
    const recent = document.getElementById("recent-series-template").content.cloneNode(true);
    const special = document.getElementById("special-series-template").content.cloneNode(true);
    main.appendChild(recent);
    main.appendChild(special);
    populateSeries();
}

// Entry Point
document.addEventListener('DOMContentLoaded', function() {
    initMainPage();
});
