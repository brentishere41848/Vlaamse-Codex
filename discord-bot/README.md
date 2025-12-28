# VLAAMSCODEX Discord bot (GitHub Releases → Discord)

Deze bot monitort **GitHub Releases** via polling en post automatisch elke **nieuwe publish** naar het changelog-kanaal in Discord (vast kanaal ID: `1454574317873397771`).

## Wat betekent “publish”?

Met “publish” bedoelen we: een **GitHub Release** die effectief gepubliceerd is (dus **geen draft**). Prereleases worden standaard **meegenomen** (configureerbaar).

## Installatie

1) Dependencies installeren

```bash
npm install
```

2) `.env` configureren

- Kopieer `.env.example` naar `.env`
- Vul minstens `DISCORD_TOKEN` en `CLIENT_ID` in

3) Slash commands (guild commands)

```bash
npm run deploy
```

Op veel hosters is dit niet nodig: de bot deployt de commands ook automatisch bij opstart (zolang `CLIENT_ID` correct staat).

4) Bot starten

```bash
npm start
```

## Bot uitnodigen + permissions

Zorg dat de bot in je server staat met minstens deze permissies in het changelog-kanaal:

- View Channel
- Send Messages
- Mention @everyone, @here, and All Roles (alleen nodig als `MENTION_EVERYONE=true`)

## Testen

Gebruik `/forcecheck` om onmiddellijk een GitHub check te forceren. Deze command post zelfs als de release al bekend is.

## State (persistente opslag)

De bot bewaart status in `src/state.json`:

- `lastReleaseId`: laatst bekende GitHub release ID
- `channelId`: doelkanaal voor announcements
- `mentionEveryone`: @everyone AAN/UIT

Resetten kan door `src/state.json` te verwijderen; de bot maakt het bestand automatisch opnieuw aan bij opstart.
