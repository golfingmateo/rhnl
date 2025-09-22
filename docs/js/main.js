// const API_BASE_URL = './data';
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



async function addSermonThumbnail(sermon, container){
    const tmpl = document.getElementById("video-thumbnail-template")
    const clone = tmpl.content.cloneNode(true);
    clone.querySelector("img").src = sermon.thumbnail_url;
    clone.querySelector("img").alt = sermon.title;
    clone.querySelector(".thumbnail-title").textContent = sermon.title;
    const clickable = clone.querySelector(".thumbnail-container");
    clickable.addEventListener("click", () => { showSermon(sermon); });
    container.appendChild(clone);
}



async function populateRecentSermons(){
    const series = await  fetchJson( API_BASE_URL + '/index.json');
    const most_recent = series.find(sermon => sermon.title === "Most Recent");
    if(!most_recent) {
        console.warn('No "Most Recent" series found.');
        return;
    }

    const container = document.getElementById("recent-sermons-container");
    const sermons = await fetchJson( API_PLAYLIST + most_recent.filename);
    sermons.forEach(sermon => { 
        addSermonThumbnail(sermon, container);
    });
}


async function populateSeries(){
    const recent = document.getElementById("recent-series-container");
    const special = document.getElementById("special-series-container");
    const series = await  fetchJson( API_BASE_URL + '/index.json');
    series.forEach(sermon => {
        if(sermon.title == "Most Recent") return; // Skip Most Recent
        console.log(sermon.thumbnail_url);
        const tmpl = document.getElementById("series-thumbnail-template")
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector("img").src = API_BASE_URL + sermon.thumbnail_url;
        clone.querySelector("img").alt = sermon.title;
        // clone.querySelector(".thumbnail-title").textContent = sermon.title;
        const clickable = clone.querySelector(".thumbnail-container");
        clickable.addEventListener("click", () => { showSeries(sermon); });
        // Append to the correct container
        if(sermon.category == "Special Series"){
            special.appendChild(clone);
        }else{
            recent.appendChild(clone);
        }
    });
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


async function showSeries(sermonSeries){
    const main = document.getElementById("main");
    main.innerHTML = ''; // Clear previous content

    const seriesPage = document.getElementById("series-template").content.cloneNode(true);
    seriesPage.querySelector("h1").textContent = sermonSeries.title;
    main.appendChild(seriesPage);
    const returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        showMainPage();
    });
    const container = document.getElementById("sermons-container");
    const sermons = await fetchJson( API_PLAYLIST + sermonSeries.filename);
    sermons.forEach(sermon => { 
        addSermonThumbnail(sermon, container);
    });

    // Scroll to top
    window.scrollTo(0, 0);  
}


async function showSermon(sermon){
    const main = document.getElementById("main");
    main.innerHTML = ''; // Clear previous content

    const sermonPage = document.getElementById("sermon-template").content.cloneNode(true);

    sermonPage.querySelector("h1").textContent = sermon.title;

    // Set the video iframe src and title in the template using id
    const iframe = sermonPage.getElementById("sermon-video");
    iframe.src = `https://www.youtube.com/embed/${sermon.video_id}`;
    iframe.title = sermon.title;

    // Add Sermon description text
    const sermonDescription = sermonPage.getElementById("sermon-description");
    sermonDescription.innerHTML = `<p>${sermon.description}</p>`;

    

    // Add event listener to return button
    const returnButton = sermonPage.getElementById("return-button");
    returnButton.addEventListener("click", (e) => {
        e.preventDefault();
        showMainPage();
    });

    main.appendChild(sermonPage);
    // Scroll to top
    // window.scrollTo(0, 0);
}

/*
LOGIC:
    - Show Main Page (Most Recent Sermons, Most Recent Series, Live Stream)
    - Show Series (List of Sermons in Series)
    - Show Sermon (Video Player, Sermon Notes, Resources)
    - Show Live Stream (Video Player)

*/

// Add Entry Point into Loading Page
document.addEventListener('DOMContentLoaded', function() {
    showMainPage();
});



