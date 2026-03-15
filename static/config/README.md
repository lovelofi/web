# Station Manifest Guide

This folder powers the extension's over-the-air station catalog.

Production URL:
- `https://lovelofi.app/config/stations.json`

The extension keeps a built-in fallback list, then layers this manifest on top.
That means bad deploys or fetch failures will not break radio completely.

## Manifest Shape

```json
{
  "version": 1,
  "updatedAt": "2026-03-15T00:00:00Z",
  "featuredStationIds": ["somafm-fluid", "somafm-groovesalad"],
  "overrides": [],
  "additions": []
}
```

## Common Operations

### Disable a dead station

```json
{
  "id": "box-lofi",
  "disabled": true
}
```

### Replace a broken stream URL

```json
{
  "id": "radio-record-lofi",
  "streamUrl": "https://new-host.example/lofi.aacp",
  "backupUrl": "https://backup-host.example/lofi.aacp"
}
```

### Promote or change featured stations

Set `featuredStationIds` in the exact order you want shown in the app.
Only known station IDs will be used.

```json
[
  "somafm-fluid",
  "somafm-dronezone",
  "jazz24"
]
```

### Add a new station

```json
{
  "id": "new-station-id",
  "name": "New Station",
  "genre": "ambient",
  "streamUrl": "https://example.com/stream",
  "backupUrl": "https://backup.example.com/stream",
  "tier": "premium",
  "adFree": true
}
```

## Supported Genres

- `lo-fi-hip-hop`
- `chillhop`
- `jazz`
- `ambient`
- `synthwave`
- `chill-out`
- `lounge`

## Supported Tiers

- `free`
- `premium`

## Safe Editing Tips

- Increase `updatedAt` whenever you change the file.
- Prefer `overrides` before `additions` when replacing existing streams.
- Use `disabled: true` instead of deleting old IDs from history if you may want them back later.
- Test the raw stream URL in a browser or media player before deploying.
- Deploy the website after changing this file so Cloudflare serves the new manifest.

## Rollback

If a manifest change causes problems:
- revert `stations.json`
- redeploy the website
- the extension will refresh automatically and still has the built-in fallback list
