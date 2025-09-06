
#!/usr/bin/env python3
"""
YouTube Channel JSON Extractor with video descriptions
"""

import subprocess
import json
import sys
import os

# List of Playlists to resync
CHANNEL_URL = "https://www.youtube.com/@RealityHonolulu"
PLAYLISTS = [
    "The Parables of Jesus",
    "Vision Sunday",
    "Mark",
    "Ruth Equip Class"
]
REFRESH_PLAYLIST = [
    "Marks"
]
PLAYLISTS = [p.lower().strip() for p in PLAYLISTS]
REFRESH_PLAYLIST = [p.lower().strip() for p in REFRESH_PLAYLIST]

def _inplaylist(title, playlist):
    return any(target == title.lower() for target in playlist)

def get_channel_json():
    """Get specific playlists by name."""

    playlists = []
    playlists.append({
        "title": "Most Recent",
        "filename": "most-recent.json"
    })
    # Get all playlists from channel
    cmd_playlists = ['yt-dlp', '--dump-json', '--flat-playlist', f"{CHANNEL_URL}/playlists"]
    playlist_data = run_command(cmd_playlists)

    os.makedirs("playlists", exist_ok=True)
    # Process only target playlists
    for item in playlist_data:
        if item.get('webpage_url_basename') == 'playlist':
            playlist_title = item.get('title', '').strip()
            filename = playlist_title.lower().replace(" ", "-")
            # Check if this playlist matches any of our targets
            if _inplaylist(playlist_title, PLAYLISTS):
                thumbnail = f'/docs/images/{filename}.jpg'
                if not os.path.exists(f'./{thumbnail}'):
                    thumbnail = item.get('thumbnails', [{}])[-1].get('url')
                playlist = {
                    "title": playlist_title,
                    "filename": f"{filename}.json",
                    "thumbnail_url": thumbnail,
                    "link": item.get('url', '')
                    # "color": "#57f2a5",
                }
                playlists.append(playlist)

                # Get videos for this playlist with full details
                if _inplaylist(playlist_title, REFRESH_PLAYLIST) and item.get('url'):
                    print(f"Downloading Videos for : {playlist_title}")
                    playlist_videos = get_playlist_videos_with_details(item.get('url'))
                    with open(f"./docs/playlists/{filename}.json", "w", encoding='utf-8') as f:
                        json.dump(playlist_videos, f, indent=2, ensure_ascii=False)
                    print("Wrote json")

    build_latest_playlist()
    # Write to file
    with open('./docs/index.json', 'w', encoding='utf-8') as f:
        json.dump(playlists, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to ./docs/playlists.json", file=sys.stderr)


def build_latest_playlist():
    all_videos = []
    for file in os.listdir("playlists"):
        if(file != 'most-recent.json'):
            with open(f"playlists/{file}", 'r', encoding='utf-8') as f:
                all_videos += json.load(f)

    all_videos = sorted(all_videos, key=lambda x: x.get('timestamp'), reverse=True)
    all_videos = all_videos[:15]
    with open('./playlists/most-recent.json', 'w', encoding='utf-8') as f:
        json.dump(all_videos, f, indent=2, ensure_ascii=False)

def get_playlist_videos_with_details(playlist_url):
    """Get videos from playlist with full details including descriptions."""

    videos = []

    # Get video IDs first
    cmd = ['yt-dlp', '--dump-json', '--flat-playlist', playlist_url]
    video_items = run_command(cmd)

    # Get details for each video
    for item in video_items:
        if item.get('_type') == 'url' and item.get('id'):
            # videos.append({
            #     'title': item.get('title', ''),
            #     'id': item.get('id')
            # })
            video_details = get_video_details(item.get('id'))
            if video_details:
                print(f"downloading details for {item.get('id')}")
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

def get_video_details(video_id):
    """Get full video details including description."""
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    cmd = ['yt-dlp', '--dump-json', '--no-download', video_url]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode == 0 and result.stdout.strip():
            video_data = json.loads(result.stdout.strip())
            return {
                "title": video_data.get('title', ''),
                "description": video_data.get('description', ''),
                "date": video_data.get('upload_date', ''),
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
