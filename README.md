# Buy Nothing — web

React + TypeScript + Vite build of the **Buy Nothing** designs:
[desktop (AFTER — 03)](https://www.figma.com/design/7ha1PZexmefU5YE6ITl09u/Buy-Nothing?node-id=447-3871) and
[mobile (AFTER — 02)](https://www.figma.com/design/7ha1PZexmefU5YE6ITl09u/Buy-Nothing?node-id=444-3285).
Below 1024px the app switches to the mobile layouts (top app bar + bottom nav); at 1024px and up it uses the desktop header.

| Route | Desktop frame | Mobile frame |
| --- | --- | --- |
| `#/` | D1 · Browse | M1 · Browse + M2 · Filter & sort sheet |
| `#/item/:id` | D2 · Item Details | M3 · Item Details (receiver) |
| `#/giving/:id` | — (single column) | M4 · Your giveaway (choose recipient) |
| `#/give` | — (single column) | M5 · Post one item / M6 · Post several |
| `#/my-items` | — (single column) | M7 · My Items |
| `#/messages` | D3 · Messages split view | M8 · Inbox |
| `#/messages/:id` | D3 (selected thread) | M9 · Chat |

## Getting started

```bash
npm install
npm run fetch-assets   # downloads images + icons from Figma into public/assets
npm run dev
```

## Structure

- `src/styles/tokens.css` — colour, spacing, radius and type tokens from the Figma variables/text styles
- `src/styles/mobile.css` — mobile layouts and chrome (top bar, bottom nav, bottom sheet)
- `src/components/` — Header, TopBar, BottomNav, FilterSheet, Button, Chip, Tag, Avatar, SearchBar, Toggle, form fields, PhotoTile, GivingMethodOption, ItemCard, MyItemRow, InterestedRow, ConversationRow, MessageBubble
- `src/pages/` — Browse, ItemDetails, Giveaway, Give, MyItems, Messages
- `src/state/` — in-memory stores for filters, interests, your giveaways and messages (shared by both layouts)
- `src/data.ts` — sample items, neighbours, giveaways and conversations (copy from the designs)
- `src/assets.ts` — every image/icon path; files live in `public/assets`

## Assets

`scripts/fetch-figma-assets.sh` pulls each asset from the Figma MCP export URLs.
Those URLs expire about a week after 2026-11-03; after that, re-export from Figma
using the file names listed in the script.
