# Buy Nothing — web

React + TypeScript + Vite build of the **Buy Nothing** desktop designs
([Figma: AFTER — 03 Desktop Screens](https://www.figma.com/design/7ha1PZexmefU5YE6ITl09u/Buy-Nothing?node-id=447-3871)).

| Route | Figma frame |
| --- | --- |
| `#/` | D1 · Browse — Desktop |
| `#/item/:id` | D2 · Item Details — Desktop (Receiver) |
| `#/messages` | D3 · Messages — Desktop (split view) |

## Getting started

```bash
npm install
npm run fetch-assets   # downloads images + icons from Figma into public/assets
npm run dev
```

## Structure

- `src/styles/tokens.css` — colour, spacing, radius and type tokens from the Figma variables/text styles
- `src/components/` — Header, Button, Chip, Tag, Avatar, SearchBar, Toggle, TextAreaField, ItemCard, ConversationRow, MessageBubble
- `src/pages/` — Browse, ItemDetails, Messages
- `src/data.ts` — sample items, neighbours and conversations (copy from the designs)
- `src/assets.ts` — every image/icon path; files live in `public/assets`

## Assets

`scripts/fetch-figma-assets.sh` pulls each asset from the Figma MCP export URLs.
Those URLs expire about a week after 2026-11-03; after that, re-export from Figma
using the file names listed in the script.
