# Planning Poker

[![CI](https://github.com/alan-falloon-fcs/planning-poker/actions/workflows/ci.yml/badge.svg)](https://github.com/alan-falloon-fcs/planning-poker/actions/workflows/ci.yml)

A planning-poker table for a team that's already on a call. Pick a card, flip the coin, clear the table.

**Play:** https://planning-poker-qj3s.onrender.com

`/` redirects to a fresh room; share the `/room/XXXXXX` link to invite players.

The query string picks the deck and the language:

| Param | Effect |
| --- | --- |
| `?deck=doub` | 1, 2, 4, 8, ?, ☕ (the default) |
| `?deck=fib` | 1, 2, 3, 5, 8, 13, ?, ☕ |
| `?deck=XS,S,M,L,?` | The listed faces, in order: 2 to 10 cards of up to 3 characters each |
| `?lang=de` | One of `en`, `zh`, `hi`, `es`, `ar`, `fr`, `pt`, `ru`, `ja`, `de`; without it the browser's language is used |

## Run locally

```sh
npm install
npm start            # builds the client and serves on http://localhost:3000
```

`npm run dev` runs the same server with Vite hot reload. `PORT` overrides the port.

## Behaviour

- Rooms live in memory only. A dropped player keeps their seat and card for 60 seconds; a room with no players is removed after 10 minutes.
- The deck belongs to the room. Opening a room link with a deck param switches everyone at the table to that deck and takes back any played card it doesn't have; the address bar and the copied room link always carry the room's deck.
- The most recently played card rests on top of any card it overlaps.
- While the coin is face-down the server withholds card values from everyone except the card's owner.
- The calculator is per player: drag it from the shelf onto the table to see the average (or, with its switch on MODE, the most played number) of the face-up numbered cards. Its spot and switch are remembered in `localStorage`.
- The fireworks box is shared. Once loaded, it launches for everyone when the coin is face-up and every played card shows the same number, then needs loading again.
- Initials/emoji are remembered in `localStorage`; the per-room player secret is in `sessionStorage`, so a refresh rejoins the same seat.

## Test

```sh
npm test
npm run typecheck
```

## Deploy

The app runs on a single Render free instance, which sleeps when idle; the first visit after a sleep takes up to a minute and starts with no rooms. It must stay on one instance, since room state is in memory.

- Build command: `npm install && npm run build`
- Start command: `npx tsx server/index.ts`

Render does not deploy on push. Deploy from the Render dashboard with **Manual Deploy**, between games, since a deploy drops every room.

Dependabot opens weekly update PRs; minor and patch updates auto-merge once CI passes.

## License

[MIT](LICENSE) © Farmlands Co-operative Society Limited
