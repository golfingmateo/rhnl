#!/usr/bin/env python3
"""
YouTube Channel JSON Extractor with video descriptions
"""

import subprocess
import json
import sys


PLAYLISTS = [
    "The Parables of Jesus Playlist",
    "Vision Sunday",
    "Mark",
    "Ruth Equip Class"
# https://youtube.com/playlist?list=PLwwLAokm-4lwh7ypFMadOoRoJQfFRL0Kx&si=JaDUYd5VR6GU2sbJ
]

def get_channel_json():
    """Get specific playlists by name."""
    channel_url = "https://www.youtube.com/@RealityHonolulu"

    # Hardcoded playlist names to search for
    target_playlists = [url.lower() for url in PLAYLISTS]

    playlists = []

    # Get all playlists from channel
    cmd_playlists = ['yt-dlp', '--dump-json', '--flat-playlist', f"{channel_url}/playlists"]
    playlist_data = run_command(cmd_playlists)

    # Process only target playlists
    for item in playlist_data:
        if item.get('webpage_url_basename') == 'playlist':
            playlist_title = item.get('title', '')
            # Check if this playlist matches any of our targets
            if any(target.lower() in playlist_title.lower() for target in target_playlists):
                playlist = {
                    "title": playlist_title,
                    "thumbnail_url": item.get('thumbnails', [{}])[-1].get('url'),
                    "link": item.get('url', ''),
                    "color": "#57f2a5",
                }
                playlists.append(playlist)

                # Get videos for this playlist with full details
                if item.get('url'):
                    playlist_videos = get_playlist_videos_with_details(item.get('url'))
                    with open(f"./{playlist_title}.json", "w", encoding='utf-8') as f:
                        json.dump(playlist_videos, f, indent=2, ensure_ascii=False)


    # Print to console
    print(json.dumps(playlists, indent=2))

    # Write to file
    with open('./playlists-index.json', 'w', encoding='utf-8') as f:
        json.dump(playlists, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to ./playlists.json", file=sys.stderr)


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
            print(video_data)
            return {
                "title": video_data.get('title', ''),
                "description": video_data.get('description', ''),
                "date": video_data.get('upload_date', ''),
                # "url": video_data.get('url', '')
                "video_id": video_id
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
