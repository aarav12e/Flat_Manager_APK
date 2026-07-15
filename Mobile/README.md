# Nestlist — Flat/Society Manager (Mobile App)

A React Native + Expo app for a housing society: flat owners register themselves,
see a directory of other flats, list their flat for rent/sale, report issues, and
send suggestions. The admin sends notices (broadcast or targeted), sees every
flat's full details, and manages reported issues.

This is the **mobile app only**, using mock local data (via AsyncStorage) so it's
fully usable right now in Expo Go. The backend (Node.js) comes next — see
"Connecting the real backend" below.

## Run it

1. Install [Expo Go](https://expo.dev/go) on your phone (Android/iOS).
2. On your computer:
   ```bash
   cd FlatManagerApp
   npm install
   npx expo start
   ```
3. Scan the QR code shown in the terminal with the Expo Go app (Android: use the
   in-app scanner; iOS: use the Camera app).

## Demo accounts

| Role  | Phone       | Password  |
|-------|-------------|-----------|
| Admin | 9999900000  | admin123  |
| Owner | 9876500002  | pass123   |

Or tap **"New owner? Register your flat"** on the login screen to create your own account.

## One login screen, two experiences

There's a single login screen for everyone. After logging in, `AppNavigator`
checks the logged-in user's `role` ("admin" or "owner") and routes to a
completely different tab layout — the person never picks a role themselves;
it's decided by which account they log into. The demo admin account already
exists (seeded); every other account created via "Register" is an owner.

## What each role can do

**Owner**
- **Notices** — see broadcast notices and any reminders sent directly to their flat
- **Directory** — see every other flat's number, owner name, and phone number only
- **My flat** — mark the flat as "for rent" / "for sale" / not listed, with details
- **Report** — report a maintenance issue to the admin, see status of past reports
- **Suggest** — send a free-text suggestion to the admin

**Admin**
- **Dashboard** — quick stats (flats, listed flats, open issues, suggestions)
- **Notices** — broadcast a notice to everyone, see notice history
- **Members** — full list of flats with owner + phone; tap a flat to send it a
  targeted reminder (e.g. maintenance bill)
- **Reports** — see every reported issue (mark resolved) and every suggestion

## Project structure

```
App.js                        entry point, loads fonts, wraps navigation
src/
  theme/theme.js               design tokens (colors, type, spacing)
  context/AuthContext.js       current user + login/register/logout
  services/api.js              all data access — the ONLY file that needs to
                                change when the real backend is ready
  services/mockDb.js           seed data used by api.js right now
  navigation/
    AppNavigator.js            routes to Login/Register or the right tab set
    OwnerTabs.js
    AdminTabs.js
  screens/                     one file per screen
  components/                  shared UI (Button, Input, cards, nameplate)
```

## Connecting the real backend

Every screen calls functions from `src/services/api.js` — never AsyncStorage or
mock data directly. When the Node.js API is ready:

1. Set `BASE_URL` at the top of `src/services/api.js` to your server's URL.
2. Replace each function body (e.g. `login`, `getAllFlats`, `sendNotice`) with a
   `fetch(BASE_URL + "/...")` call that returns the same shape of data it does now.
3. No screen or component needs to change.

## Design

Visual language is a housing-society **directory nameplate**: unit numbers set in
a monospaced "plate" type against an ink-navy tag, like an engraved door plate,
with a warm amber accent standing in for the building's notice board / bell.
