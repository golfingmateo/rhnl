const API_BASE_URL = '../../docs/';
// const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/';

const API_PLAYLIST = API_BASE_URL + 'playlists/';

let SERIES = [];
// let currentVideos = [];
let ACTIVE_SERIES_INDEX = 1;


function showVideo() {
    document.body.classList.add("video-mode")
}

function hideVideo() {
    document.body.classList.remove("video-mode")
}



////////////////////////////////////////////////////////////////////////////////
//////////////////// Series Data
////////////////////////////////////////////////////////////////////////////////
// Function to create a single playlist item
async function fetchSeriesData() {
    if( SERIES.length > 0 ) return;
    
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

function createSeriesItem(series, name='series-item') {
    const item = document.createElement('div');
    item.className = name;

    item.innerHTML = `
        <div class="${name}-thumbnail-container">
            <img src="${API_BASE_URL+series.thumbnail_url}" alt="${series.title}" class="${name}-thumbnail">
            <div class="watch-overlay">
                <div class="watch-overlay-text">
                    <div>${series.title}</div>
                </div>
            </div>
            
        </div>
    `;



    // item.innerHTML = `
    //     <h4 class="${name}-title">${series.title}</h4>
    // `;
    // item.innerHTML = `
    //     <img src="${series.thumbnail_url}" alt="${series.title}" class="${name}-thumbnail">
    //     <h4 class="${name}-title">${series.title}</h4>
    // `;

        console.log(item);
    // console.log(series);
    return item;
}

// Function to fetch and populate sidebar with sermon series
async function populateSeries() {
    await fetchSeriesData();
    const seriesContainer = document.getElementById('series-container');
    SERIES.forEach((series) => {
        if(series.title == "Most Recent") return;
        const item = createSeriesItem(series);
        console.log(item);
        seriesContainer.appendChild(item);
    });
}





function createPlayListHeader(series){
    const item = document.createElement('div');
    item.className = 'playlist-header';
    item.innerHTML = `
        <img src="${series.thumbnail_url}" alt="${series.title}" class="playlist-header-thumbnail">
        <h4 class="playlist-header-heading">${series.title}</h4>
    `;
    return item;
}
function createPlaylistItem(video) {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    // <div class="playlist-item-image">
    //         <img src="${video.thumbnail_url}" alt="${video.title}" class="playlist-item-thumbnail">
    //     </div>
        //     <div class="playlist-item-info">
        //     <h4 class="playlist-item-heading">${series.title}</h4>
        //     <p class="playlist-item-body">${series.title}</p>
        // </div>
    item.innerHTML = `
    <div class="playlist-item-image">
        <img src="${video.thumbnail_url}" alt="${video.title}" class="playlist-item-thumbnail">
    </div>
        <div class="playlist-item-info">
            <h4 class="playlist-item-heading">${series.title}</h4>
            <p class="playlist-item-body">${series.title}</p>
        </div>
    `;
    return item;
}

async function fecthPlaylistData(series) {
    let playlist_path = API_PLAYLIST + series.filename;
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


async function populatePlaylist() {
    let current_series = SERIES[ACTIVE_SERIES_INDEX];

    let data = await fecthPlaylistData(current_series);

    let playlist = document.getElementById('playlist');
    document.getElementById('playlist-title').textContent = current_series.title;
    // document.getElementById('playlist-thumbnail').textContent = current_series.thumbnail_url;
    // Create playlist items for each series
    data.forEach((video) => {
        const item = createPlaylistItem(video);
        playlist.appendChild(item);
    });
}



document.getElementById('scroll-btn-left').onclick = function() {
    document.getElementById('series-container').scrollBy({ left: -380, behavior: 'smooth' });
};
document.getElementById('scroll-btn-right').onclick = function() {
    document.getElementById('series-container').scrollBy({ left: 380, behavior: 'smooth' });
};



async function init() {
    await fetchSeriesData()
    populateSeries();
    // populatePlaylist();
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