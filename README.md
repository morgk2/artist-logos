# Artist Logos

Community-made title logos for artists, used by the 8SPINE artist page in place of plain text artist names.

Logos are served straight from this repo. The app downloads `index.json`, looks up the artist's Apple Music ID, and shows the matching logo. If there isn't one, it falls back to the Apple Music logo (or the artist's name).

## Contributing a logo

1. Find the artist's **Apple Music artist ID**. It's the number at the end of the artist URL: `music.apple.com/us/artist/frank-ocean/**2053228893**`.
2. Make the logo a **PNG with a transparent background**, ideally **white or light** artwork (the artist page sits over a dark header).
3. Save it as `logos/<artist-id>.png`.
4. Open a pull request. CI checks the file; `index.json` is rebuilt automatically after merge, so don't edit it.

### Requirements

- Filename is exactly `<apple-artist-id>.png`
- Transparent PNG (RGBA)
- Between 200x20 and 2400x1200 px, wide aspect ratios work best (roughly 3:1 to 8:1)
- Under 1 MB
- Tightly cropped, no extra padding
- Only submit logos you made or that are freely usable. No stolen or watermarked images.

Check locally with `node scripts/build-index.js --check`.
