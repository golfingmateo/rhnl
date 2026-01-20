// Main application logic with hash-based routing for Squarespace embedding

const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/data/';
const API_PLAYLIST = API_BASE_URL + 'playlists/';

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error){
        console.error('Error fetching sermon series:', error);
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

// Parse hash parameters
function getHashParams() {
    const hash = window.location.hash.slice(1); // Remove #
    const params = new URLSearchParams(hash);
    return {
        view: params.get('view') || 'main',
        videoId: params.get('videoId'),
        title: params.get('title'),
        thumbnail: params.get('thumbnail'),
        description: params.get('description'),
        series: params.get('series'),
        filename: params.get('filename')
    };
}

// Set hash parameters
function setHashParams(params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key]) {
            searchParams.set(key, params[key]);
        }
    });
    window.location.hash = searchParams.toString();
}

async function addSermonThumbnail(sermon, container, seriesFilename = null){
    const tmpl = document.getElementById("video-thumbnail-template")
    const clone = tmpl.content.cloneNode(true);
    clone.querySelector("img").src = sermon.thumbnail_url;
    clone.querySelector("img").alt = sermon.title;
    clone.querySelector(".thumbnail-title").textContent = sermon.title;
    const clickable = clone.querySelector(".thumbnail-container");

    clickable.addEventListener("click", () => {
        const params = {
            view: 'video',
            videoId: sermon.video_id,
            title: sermon.title,
            thumbnail: sermon.thumbnail_url,
            description: sermon.description || ''
        };
        if (seriesFilename) {
            params.series = seriesFilename;
        }
        setHashParams(params);
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
    series.forEach(sermon => {
        if(sermon.title == "Most Recent") return; // Skip Most Recent

        const tmpl = document.getElementById("series-thumbnail-template")
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector("img").src = API_BASE_URL + sermon.thumbnail_url;
        clone.querySelector("img").alt = sermon.title;
        const clickable = clone.querySelector(".thumbnail-container");

        clickable.addEventListener("click", () => {
            setHashParams({
                view: 'series',
                filename: sermon.filename,
                title: sermon.title
            });
        });

        // Append to the correct container
        if(sermon.category == "Special Series"){
            special.appendChild(clone);
        }else{
            recent.appendChild(clone);
        }
    });
}

async function showMainPage() {
    const main = document.getElementById("main");
    main.innerHTML = ''; // Clear previous content

    const live = document.getElementById("livestream-section-template").cloneNode(true);
    main.appendChild(live.content);
    if(showLivestream()){
        const container = document.getElementById("livestream-container");
        const tmpl = document.getElementById("active_livestream-template");
        const clone = tmpl.content.cloneNode(true);
        container.appendChild(clone);
        document.getElementById("placeholder").hidden = true;
    }

    const recentSermons = document.getElementById("recent-sermons-template").content.cloneNode(true);
    main.appendChild(recentSermons);
    populateRecentSermons();

    const recent = document.getElementById("recent-series-template").content.cloneNode(true);
    const special = document.getElementById("special-series-template").content.cloneNode(true);
    main.appendChild(recent);
    main.appendChild(special);
    populateSeries();
}

async function showSeries(params){
    const main = document.getElementById("main");
    main.innerHTML = ''; // Clear previous content

    const seriesPage = document.getElementById("series-template").content.cloneNode(true);
    seriesPage.querySelector("h1").textContent = params.title || 'Series';
    main.appendChild(seriesPage);

    const returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = '';
    });

    const container = document.getElementById("sermons-container");
    const sermons = await fetchJson(API_PLAYLIST + params.filename);
    sermons.forEach(sermon => {
        addSermonThumbnail(sermon, container, params.filename);
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

async function showSermon(params){
    const main = document.getElementById("main");
    main.innerHTML = ''; // Clear previous content

    const sermonPage = document.getElementById("sermon-template").content.cloneNode(true);

    sermonPage.querySelector("h1").textContent = params.title || 'Sermon';

    // Set the video iframe src and title in the template using id
    const iframe = sermonPage.getElementById("sermon-video");
    iframe.src = `https://www.youtube.com/embed/${params.videoId}`;
    iframe.title = params.title || 'Sermon Video';

    // Add Sermon description text
    const sermonDescription = sermonPage.getElementById("sermon-description");
    sermonDescription.innerHTML = `<p>${params.description || ''}</p>`;

    // Add event listener to return button
    const returnButton = sermonPage.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Go back to series if we came from one
        if (params.series) {
            // For now, just go to main - could enhance to go back to series
            window.location.hash = '';
        } else {
            window.location.hash = '';
        }
    });

    main.appendChild(sermonPage);
    // Scroll to top
    window.scrollTo(0, 0);
}

// Router function
async function route() {
    const params = getHashParams();

    switch(params.view) {
        case 'series':
            if (params.filename) {
                await showSeries(params);
            } else {
                await showMainPage();
            }
            break;
        case 'video':
            if (params.videoId) {
                await showSermon(params);
            } else {
                await showMainPage();
            }
            break;
        case 'main':
        default:
            await showMainPage();
            break;
    }
}

// Entry Point
document.addEventListener('DOMContentLoaded', function() {
    route();
});

// Listen for hash changes
window.addEventListener('hashchange', function() {
    route();
});
