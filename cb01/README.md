# Nuvio Authorized Streams — starter plugin

This is a safe starter for Nuvio's plugin repository format. It only returns direct HTTPS media URLs from a JSON file you control and are authorized to distribute. It does **not** scrape CB01 or extract streams from third-party sites.

## Files
- `manifest.json` — Nuvio repository manifest
- `providers/authorized-streams.js` — stream provider
- `data/streams.json` — sample index; replace example URLs with your own authorized direct media URLs

## Setup
1. Create a GitHub repository and upload these files, preserving the folder structure.
2. Edit `providers/authorized-streams.js` and replace `DATA_URL` with the raw HTTPS URL to your own `data/streams.json`.
3. Edit `data/streams.json`. Keep only content you own or have explicit distribution rights for. The `tmdbId` is the TMDB numeric ID. For series, include `season` and `episode`.
4. In Nuvio, open **Settings → Content & Discovery → Plugins → Add Repository** and enter:
   `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/manifest.json`
5. Refresh the repository and enable **Authorized Streams**.

## Limitations
- Nuvio plugins provide stream sources, not a browsable film/series catalogue. Use a separate lawful metadata/catalogue add-on for browsing/search.
- The provider expects direct HTTPS media URLs such as MP4 or HLS (`.m3u8`). A webpage URL is not a playable stream URL.
- The example URLs are placeholders and will not play until replaced.
- Test on your exact Nuvio build. Plugin support may vary by app build/platform.
