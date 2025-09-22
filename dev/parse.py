
#!/usr/bin/env python3
"""
YouTube Channel JSON Extractor with video descriptions
"""

import subprocess
import json
import sys
import os
from datetime import datetime, timezone

# List of Playlists to resync
CHANNEL_URL = "https://www.youtube.com/@RealityHonolulu"
FOLDER_ROOT = "./docs/data"
# Playlist Categories?
# Summer Series: Parables of Jesus
# Events? :  Easter, Vision Sunday
# Misc?:  Guest Speakers, Advent
# Equip Classes:  Ruth, 

PLAYLISTS = {
    "Most Recent" : "",
    "Mark" : "Sermon Series",
    "The Parables of Jesus" : "Sermon Series",
    "This is Reality": "Special Series",
    "The Attributes of God" : "Special Series",
    "Philippians" : "Sermon Series",
    "Vision Sunday" : "Special Series",
    "Ruth Equip Class" : "Special Series",
}

REFRESH_PLAYLIST = [
    "Mark",
    # "The Parables of Jesus",
    # "This is Reality",
    # "The Attributes of God",
    # "Philippians",
    # "Vision Sunday",
    # "Ruth Equip Class",
]

# PLAYLISTS = [p.lower().strip() for p in PLAYLISTS]
REFRESH_PLAYLIST = [p.lower().strip() for p in REFRESH_PLAYLIST]

def playlist_category(playlist_title):
    for title, category in PLAYLISTS.items():
        if title.lower() == playlist_title.lower():
            return category
    
def is_in_playlist(title):
    return any(target.lower() == title.lower() for target in PLAYLISTS.keys())

def is_in_refreshlist(title):
    # return False
    return any(target == title.lower() for target in REFRESH_PLAYLIST)

def save_json(filename, data):
    with open(filename, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"saved {filename}")

def save_playlist(filename, data):
    save_json(f"{FOLDER_ROOT}/playlists/{filename}.json", data)

def load_playlist(filename):
    with open(f"{FOLDER_ROOT}/playlists/{filename}", 'r', encoding='utf-8') as f:
        return json.load(f)
    
def get_channel_json():
    """Get specific playlists by name."""

    playlists = []
    playlists.append({
        "title": "Most Recent",
        "filename": "most-recent.json",
        "thumbnail_url": "images/most-recent.jpg"
    })
    # Get all playlists from channel
    cmd_playlists = ['yt-dlp', '--dump-json', '--flat-playlist', f"{CHANNEL_URL}/playlists"]
    playlist_data = run_command(cmd_playlists)
    images = os.listdir(f'{FOLDER_ROOT}/images/')

    os.makedirs("playlists", exist_ok=True)
    # Process only target playlists
    for item in playlist_data:
        if item.get('webpage_url_basename') == 'playlist':
            playlist_title = item.get('title', '').split("|")[0].strip()
            filename = playlist_title.lower().replace(" ", "-")
            # Check if this playlist matches any of our targets
            # if is_in_playlist(playlist_title):
            category = playlist_category(playlist_title)
            if category:
                thumbnail = f'/images/{filename}.jpg'
                if not os.path.exists(f'{FOLDER_ROOT}/{thumbnail}'):
                    thumbnail = item.get('thumbnails', [{}])[-1].get('url')
                playlist = {
                    "title": playlist_title,
                    "category": category,
                    "filename": f"{filename}.json",
                    "thumbnail_url": thumbnail,
                    "link": item.get('url', '')
                    # "color": "#57f2a5",
                }
                playlists.append(playlist)

                # Get videos for this playlist with full details
                if is_in_refreshlist(playlist_title) and item.get('url'):
                    print(f"Downloading Videos for : {playlist_title}")
                    playlist_videos = get_playlist_videos_with_details(item.get('url'))
                    save_playlist(filename, playlist_videos)

    build_latest_playlist()

    playlists = sorted(playlists, key=lambda x: [k.lower() for k in PLAYLISTS.keys()].index(x.get('title').lower()))
    save_json(f"{FOLDER_ROOT}/index.json", playlists)


def build_latest_playlist():
    videos = []
    for file in os.listdir(f"{FOLDER_ROOT}/playlists"):
        print(file)
        if(file != 'most-recent.json'):
            videos += load_playlist(file)
    videos = sorted(videos, key=lambda x: x.get('timestamp'), reverse=True)
    videos = videos[:15]
    save_playlist('most-recent', videos)

def get_playlist_videos_with_details(playlist_url):
    """Get videos from playlist with full details including descriptions."""

    videos = []

    # Get video IDs first
    cmd = ['yt-dlp', '--dump-json', '--flat-playlist', playlist_url]
    video_items = run_command(cmd)
    # print(json.dumps(video_items[:3], indent=4))
    # Get details for each video
    for item in video_items:
        if item.get('_type') == 'url' and item.get('id'):
            if any([item.get('id') == v.get('video_id') for v in videos]):
                continue
            print(f"downloading details for {item.get('id')}")
            video_details = get_video_details(item.get('id'))
            if video_details:
                videos.append(video_details)
    return videos


def get_all_videos_with_details(videos_url):
    """Get all channel videos with full details."""
    videos = []

    # Get video IDs
    cmd = ['yt-dlp', '--dump-json', '--flat-playlist', videos_url]
    video_items = run_command(cmd)

    # Get details for each video
    for item in video_items:
        if item.get('_type') == 'url' and item.get('id'):
            video_details = get_video_details(item.get('id'))
            if video_details:
                videos.append(video_details)

    return videos

def convert_epoch_to_iso(epoch):
    dt_object_utc = datetime.fromtimestamp(epoch, timezone.utc)
    return dt_object_utc.isoformat()

def get_video_details(video_id):
    """Get full video details including description."""
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    cmd = ['yt-dlp', '--dump-json', '--no-download', video_url]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode == 0 and result.stdout.strip():
            video_data = json.loads(result.stdout.strip())
            # print(json.dumps(video_data, indent=4))
            return {
                "title": video_data.get('title', ''),
                "description": video_data.get('description', ''),
                "date": convert_epoch_to_iso(video_data['timestamp']),
                # "url": video_data.get('url', '')
                "thumbnail_url": video_data.get('thumbnails', [{}])[-1].get('url'),
                "video_id": video_id,
                "timestamp": video_data.get("timestamp")
            }
    except Exception as e:
        print(f"DEBUG: Error getting details for {video_id}: {e}", file=sys.stderr)

    return None

def run_command(cmd):
    """Run yt-dlp command and return JSON objects."""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        if result.returncode == 0 and result.stdout.strip():
            lines = result.stdout.strip().split('\n')
            json_objects = []

            for line in lines:
                if line.strip():
                    try:
                        json_objects.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
            return json_objects
        return []

    except subprocess.TimeoutExpired:
        return []
    except Exception as e:
        return []

if __name__ == "__main__":
    get_channel_json()
