# Nestlist API (Node.js + Express + MongoDB)

Backend for the Nestlist flat/society manager mobile app. JWT auth, role-based
access (`admin` / `owner`), Mongoose models, input validation, rate limiting on
auth routes, and a seed script so you have real data to test against immediately.

## Setup

**1. Install MongoDB** (pick one):
- Local: install MongoDB Community Server and run it, or `brew install mongodb-community` on Mac.
- Cloud (recommended, free tier): create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), get its connection string.

**2. Install dependencies and configure**
```bash
cd FlatManagerBackend
npm install
cp .env.example .env
```
Open `.env` and set `MONGO_URI` (and change `JWT_SECRET` to something random).

**3. Seed the database** — creates the admin account plus 3 sample owners/flats/notice/issue/suggestion so the app isn't empty:
```bash
npm run seed
```

**4. Run the server**
```bash
npm run dev      # with nodemon, auto-restarts on change
# or
npm start
```
You should see `Nestlist API running on port 5000`. Check it's alive:
```bash
curl http://localhost:5000/api/health
```

## Demo accounts (from the seed script)

| Role  | Phone       | Password  |
|-------|-------------|-----------|
| Admin | 9999900000  | admin123  |
| Owner | 9876500002  | pass123   |

## Connecting from the Expo app

Your phone (running Expo Go) can't reach `localhost` on your laptop — it needs
your laptop's LAN IP.

1. Find your computer's local IP (e.g. `192.168.1.42`) — `ipconfig` on Windows,
   `ifconfig`/`ip a` on Mac/Linux, or just look at what `expo start` prints.
2. In the mobile app's `src/services/api.js`, set:
   ```js
   export const BASE_URL = "http://192.168.1.42:5000/api";
   ```
3. Make sure your phone and laptop are on the same Wi-Fi network.
4. Replace each function in `api.js` with a `fetch(BASE_URL + "/...")` call —
   see the route table below for exact paths/methods/bodies. Store the JWT
   `token` returned by login/register (e.g. in AsyncStorage) and send it as
   `Authorization: Bearer <token>` on every other request.

If you'd like, I can do this wiring for you next — just ask.

## API reference

All routes are prefixed with `/api`. Routes marked 🔒 need `Authorization: Bearer <token>`.

### Auth
| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/auth/register` | public | `{ name, phone, password, flatNumber }` |
| POST | `/auth/login` | public | `{ phone, password }` |
| GET | `/auth/me` | 🔒 any | — |

Register/login responses: `{ token, user: { id, name, phone, role, flatId } }`

### Flats
| Method | Path | Role | Body |
|---|---|---|---|
| GET | `/flats/me` | 🔒 owner | — |
| PUT | `/flats/me` | 🔒 owner | `{ listingStatus: "none"\|"rent"\|"sale", details }` |
| GET | `/flats/directory` | 🔒 owner | — (returns every *other* flat: number, ownerName, phone, listingStatus only) |
| GET | `/flats` | 🔒 admin | — (every flat, full detail) |

### Notices
| Method | Path | Role | Body |
|---|---|---|---|
| GET | `/notices` | 🔒 owner | — (broadcasts + notices sent to their flat) |
| GET | `/notices/all` | 🔒 admin | — |
| POST | `/notices` | 🔒 admin | `{ title, body, audience }` — `audience` is `"all"` or a flat's `id` |

### Issues
| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/issues` | 🔒 owner | `{ title, description }` |
| GET | `/issues/mine` | 🔒 owner | — |
| GET | `/issues` | 🔒 admin | — |
| PATCH | `/issues/:id` | 🔒 admin | `{ status: "open"\|"resolved" }` |

### Suggestions
| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/suggestions` | 🔒 owner | `{ message }` |
| GET | `/suggestions` | 🔒 admin | — |

## Project structure

```
server.js                  entry point — connects to MongoDB, starts Express
src/
  app.js                   Express app: middleware + route mounting
  config/db.js             mongoose connection
  models/                  User, Flat, Notice, Issue, Suggestion
  middleware/
    auth.js                 protect (JWT check), requireRole(...roles)
    validate.js              turns express-validator errors into clean 400s
    errorHandler.js          notFound + centralized error formatting
  controllers/              one file per resource — the actual route logic
  routes/                   Express routers, wiring validation + controllers
  seed.js                   creates the admin + sample data
```

## Design notes

- **Passwords** are hashed with bcrypt (10 rounds); the hash is never sent to
  the client (`User.toJSON` strips it if a user doc is ever serialized).
- **Registration** creates a `User` and a `Flat` together. Standalone MongoDB
  (no replica set) can't do multi-document transactions, so if flat creation
  fails after the user was created, the code deletes that user as a manual
  rollback rather than leaving an orphaned account.
- **Directory endpoint** (`/flats/directory`) only ever returns `number`,
  `ownerName`, `phone`, and `listingStatus` — the same restriction the mobile
  app's UI enforces is enforced again on the server, so it can't be bypassed
  by calling the API directly.
- **Rate limiting** on `/auth/*` (30 requests / 15 min) to blunt brute-force
  login/registration attempts.
- **`express-mongo-sanitize`** strips any `$`/`.` keys from request bodies to
  block MongoDB operator-injection attacks.
- **Denormalized owner name/phone** on `Flat` (rather than a populate on every
  directory read) — trades a small amount of duplication for much simpler,
  faster reads, which is the right call for a small, infrequently-changing
  directory like this.

## Next steps

- Wire the Expo app's `src/services/api.js` to these endpoints (ask and I'll do it).
- Push notifications for notices (Expo push tokens + a `POST /notices` hook).
- Admin ability to remove/deactivate an owner's account.
