# ChatChannels

A real-time multi-channel chat application built with vanilla JavaScript and Node.js, demonstrating SPA architecture, RESTful API design, and MVC patterns without any frontend framework.

## Demo

> Live demo: [https://chatchannels.onrender.com]

## Features

- **Multi-channel chat** — 4 independent channels (general, random, help, questions)
- **Real-time updates** — incremental polling every 5 seconds, only fetching new messages
- **Session authentication** — cookie-based login with server-side session management
- **Multi-session support** — same user can log in from multiple browsers simultaneously
- **Responsive UI** — pink-themed, message bubbles with sent/received distinction

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla JavaScript (ES6+), Webpack, Babel |
| Backend | Node.js, Express |
| Styling | Plain CSS |
| Auth | Cookie-based session (`sid`) |
| Storage | In-memory (server restarts clear data) |

## Architecture

Follows a strict MVC pattern on the client side:

```
src/
├── index.js      # Boot — checks session on load
├── state.js      # Model — single source of truth
├── services.js   # Model — all fetch/API calls
├── render.js     # View — DOM generation
├── events.js     # Controller — event listeners
└── poll.js       # Controller — polling logic

server/
├── server.js     # Express routes + auth middleware
├── sessions.js   # Session state management
└── messages.js   # Message state by channel
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/session` | Check login status |
| `POST` | `/api/v1/session` | Login |
| `DELETE` | `/api/v1/session` | Logout |
| `GET` | `/api/v1/users` | Get online users |
| `GET` | `/api/v1/messages?channel=&after=` | Fetch messages (incremental) |
| `POST` | `/api/v1/messages` | Send a message |

## Getting Started

```bash
# Install dependencies
npm install

# Build frontend bundle
npm run build

# Start server
npm start
```

Visit `http://localhost:3000`

## Design Decisions

- **No framework** — built with vanilla JS to demonstrate core DOM manipulation and state management concepts
- **Incremental polling** — uses `after=lastMessageId` to avoid re-fetching all messages on every poll
- **Conditional rendering** — screens are mounted/unmounted from the DOM rather than hidden with CSS
- **Server-side identity** — message sender is always read from the session, never trusted from the client
