# Remote Config Guide

This folder powers the extension's over-the-air configuration. The extension fetches these manifests on startup and every 12 hours, caches them in `chrome.storage.local`, and falls back to built-in defaults if a fetch fails.

Production URLs:
- `https://lovelofi.app/config/stations.json`
- `https://lovelofi.app/config/pricing.json`
- `https://lovelofi.app/config/presets.json`

---

## Stations (`stations.json`)

The extension keeps a built-in fallback station list, then layers this manifest on top.

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
  "fluxfm-chillhop"
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
- revert the JSON file
- redeploy the website
- the extension will refresh automatically and still has built-in fallback data

---

## Pricing (`pricing.json`)

Controls checkout URLs, plan pricing labels, and the customer portal URL. All fields except `version` are optional — missing fields fall back to the extension's built-in env var defaults.

### Manifest Shape

```json
{
  "version": 1,
  "updatedAt": "2026-03-23T00:00:00Z",
  "plans": {
    "monthly": { "price": 3.99, "label": "$3.99/mo", "checkoutUrl": "https://..." },
    "annual": { "price": 19, "label": "$19/yr", "badge": "Best value", "checkoutUrl": "https://..." },
    "lifetime": { "price": 49, "label": "$49", "sublabel": "supporter", "checkoutUrl": "https://..." }
  },
  "customerPortalUrl": "https://..."
}
```

### Common Operations

#### Change a price label

Update the `label` field for the plan. This is what users see in the settings paywall.

#### Swap checkout URLs

Replace `checkoutUrl` for any plan — useful for seasonal promos or migrating to a new payment provider.

#### Update portal URL

Set `customerPortalUrl` to redirect the "Manage Billing" button.

---

## Presets (`presets.json`)

Controls the built-in preset library: add/remove/tune presets, reorder sections, change free tier access, and update time-of-day suggestions. All fields except `version` are optional.

### Manifest Shape

```json
{
  "version": 1,
  "updatedAt": "2026-03-23T00:00:00Z",
  "featuredPresetIds": ["classic-lofi", "dreamy"],
  "freePresetIds": ["classic-lofi", "late-night-study", "rainy-cafe", "dreamy"],
  "additions": [],
  "overrides": [],
  "sections": [
    { "id": "featured", "title": "Featured", "presetIds": ["classic-lofi", "dreamy"] }
  ],
  "timeSuggestions": {
    "morning": "dreamy",
    "afternoon": "rainy-cafe",
    "evening": "late-night-study",
    "late-night": "old-cassette"
  }
}
```

### Common Operations

#### Tune an existing preset

Use `overrides` to change specific effect parameters. Only the fields you specify are merged — the rest stay unchanged.

```json
{
  "id": "classic-lofi",
  "settings": { "lowPass": { "intensity": 40 } }
}
```

#### Disable a preset

```json
{
  "id": "broken-walkman",
  "disabled": true
}
```

#### Add a new preset

Add a full preset object to `additions`:

```json
{
  "id": "new-preset",
  "name": "New Preset",
  "description": "Description shown in the preset selector.",
  "settings": {
    "lowPass": { "enabled": true, "intensity": 30 },
    "highPass": { "enabled": false, "intensity": 0 },
    "tapeSaturation": { "enabled": false, "intensity": 0 },
    "reverb": { "enabled": true, "intensity": 20, "profile": "room" },
    "bitcrusher": { "enabled": false, "intensity": 0 },
    "chorus": { "enabled": false, "intensity": 0 },
    "vinylCrackle": { "enabled": false, "intensity": 0 },
    "pitchWobble": { "enabled": false, "intensity": 0 },
    "stereoDrift": { "enabled": false, "intensity": 0 },
    "dropout": { "enabled": false, "intensity": 0 },
    "slowdown": { "enabled": false, "intensity": 0 },
    "vocalCut": { "enabled": false, "intensity": 0 }
  }
}
```

Then add its ID to the relevant `sections` entry so it appears in the selector.

#### Change which presets are free

Set `freePresetIds` to the list of preset IDs accessible without premium.

#### Reorder sections

Provide `sections` with the desired order. Each section needs `id`, `title`, and `presetIds`. Sections with no valid preset IDs are hidden.

### Supported Reverb Profiles

`studio`, `room`, `hall`, `spring`, `cassette`

### Supported Time-of-Day Keys

`morning`, `afternoon`, `evening`, `late-night`
