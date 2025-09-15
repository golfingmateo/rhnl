const API_BASE_URL = './data/';
// const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/data/';

const API_PLAYLIST = API_BASE_URL + 'playlists/';

let SERIES = [];
// let currentVideos = [];
let ACTIVE_SERIES_INDEX = 0;



 console.log('Json Script');



function showVideo() {
    document.body.classList.add("video-mode")
}

function hideVideo() {
    document.body.classList.remove("video-mode")
}



////////////////////////////////////////////////////////////////////////////////
//////////////////// Sidebar
////////////////////////////////////////////////////////////////////////////////
// Function to create a single playlist item
function createSideBarItem(series) {
    const item = document.createElement('div');
    item.className = 'sidebar-item';
    // Create the HTML structure
    item.innerHTML = `
        <img src="${series.thumbnail_url}" alt="${series.title}" class="sidebar-item-thumbnail">
    `;
    // item.innerHTML = `
    //     <div class="sidebar-icon">
    //         <img src="${series.thumbnail_url}" alt="${series.title}" class="sidebar-item-thumbnail">
    //     </div>
    //     <div class="sidebar-item-info">
    //         <h4 class="sidebar-item-title">${series.title}</h4>
    //     </div>
    // `;
    
    return item;
}

// Function to fetch and populate sidebar with sermon series
async function populateSideBar() {
    const sidebarContainer = document.getElementById('sidebar');
    SERIES.forEach((series) => {
        const item = createSideBarItem(series);
        sidebarContainer.appendChild(item);
    });
}



function createPlaylistItem(video) {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    // Create the HTML structure
    // item.innerHTML = `
    //     <div class="sidebar-icon">
    //         <img src="${video.thumbnail_url}" alt="${video.title}" class="playlist-item-thumbnail">
    //     </div>
    //     <div class="playlist-item-info">
    //         <h4 class="playlist-item-title">${video.title}</h4>
    //     </div>
    // `;

    // item.innerHTML = `
    //     <div class="playlist-item">
    //         <img src="${video.thumbnail_url}" alt="${video.title}" class="playlist-item-thumbnail">
    //         <h3 class="playlist-item-title">${video.title}</h4>
    //     </div>
    // `;

     item.innerHTML = `
        <div class="playlist-item">
            <img src="${video.thumbnail_url}" alt="${video.title}" class="playlist-item-thumbnail">
        </div>
    `;
    return item;
}



async function populatePlaylist() {

    let data = await getPlaylistData();

    let playlist = document.getElementById('playlist');
    document.getElementById('playlist-title').textContent = SERIES[ACTIVE_SERIES_INDEX].title;
    // Create playlist items for each series
    data.forEach((video) => {
        const item = createPlaylistItem(video);
        playlist.appendChild(item);
    });
}

async function setPlaylist() {
    active_playlist = 'most_recent'
    document.getElementById('playlist-title').textContent = data.title;

    const mostRecentIndex = playlists.findIndex(playlist => 
        playlist.filename && playlist.filename.toLowerCase().includes('most-recent')
    );
}

async function getPlaylistData() {
    let current_playlist = SERIES[ACTIVE_SERIES_INDEX];
    let playlist_path = API_PLAYLIST + current_playlist.filename;
    try {
        const response = await fetch(playlist_path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error){
        console.error('Error fetching sermon series:', error);
        return [];
    }
}



async function loadData() {
    try {
        const response = await fetch( API_BASE_URL + '/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        SERIES = await response.json();
    } catch (error){
        console.error('Error fetching sermon series:', error);
    }
}


async function init() {
    await loadData()
    // populateSideBar();
    // populatePlaylist();

    SERIES.forEach((series) => {
        if(series.title == "Most Recent") return;
        const tmpl = document.getElementById("video-thumbnail-template");
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector("img").src = series.thumbnail_url;
        clone.querySelector("img").alt = series.title;
        clone.querySelector(".video-thumbnail-title").textContent = "watch";
        document.getElementById("series-sermon-section").appendChild(clone);


    });
}

// Add Entry Point into Loading Page
document.addEventListener('DOMContentLoaded', function() {
    init();
});


// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', init);
// } else {
//     init();
// }