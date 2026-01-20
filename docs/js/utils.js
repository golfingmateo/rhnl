// Shared utilities for all pages

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
