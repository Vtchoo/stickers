# Sticker Album Manager

Expo React Native MVP for managing collectible sticker albums locally on-device.

## Stack

- Expo
- React Native
- TypeScript
- styled-components
- AsyncStorage for local-first persistence

## Included in v1

- Album template browser
- Multiple personal albums from the same template
- FIFA World Cup 2026 seed template
- Progress stats for total, owned, missing, duplicates, and completion
- Search by slot ID, team, group, country, sticker type, and placeholder player labels
- List view with collapsible sections
- Simulated album page view with tap-to-register mode
- Duplicate and trade list

## Seed data note

The FIFA World Cup 2026 seed mixes verified data and placeholders:

- Verified from FIFA pages: tournament groups, 16 host stadiums, and the official Panini app statement that there are 528 player stickers across 48 teams.
- Placeholder for now: exact physical sticker IDs, full player names, positions, and some special sections.

The app uses predictable IDs so you can replace the seed with a fuller checklist later without changing app logic.

## Run

```bash
npm install
npx expo start
```