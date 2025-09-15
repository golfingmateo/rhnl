
// const API_BASE_URL = './';
const API_BASE_URL = 'https://raw.githubusercontent.com/golfingmateo/rhnl/main/docs/';

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
        // clone.querySelector("h4").textContent = series.title;
        document.getElementById("most-recent-sermons-thumbnail-list-container").appendChild(clone);


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