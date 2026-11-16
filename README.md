# Timetable

A small timetable web app for phone and desktop. Each person signs up and keeps their own weekly timetable, checklist, to-dos, deadlines, links and mood calendar. Data syncs through Firebase and works offline.

一个手机和电脑都能用的时间表网站。每个人注册自己的账号，课表、清单、待办、截止日期、链接和心情日历都只属于自己，通过 Firebase 同步，没网也能用。

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole app: styles, page layout, English/Chinese text, app logic, Firebase sync |
| `firestore.rules` | Server-side rules: each user only reads/writes their own data; first 100 sign-ups are open, then an invite code is needed |
| `sw.js` | Offline cache |
| `_redirects` | Netlify proxy so Google sign-in works from the iPhone home screen |
| `manifest.webmanifest`, icons, `room.jpg`, `treasure-chest-icon.png` | Home-screen icon and desktop room artwork |

## Deploy

1. Drag the folder into Netlify (Deploys page).
2. Firebase → Authentication → Settings → Authorized domains: add the Netlify domain.
3. Google Cloud → OAuth client: add `https://<site>` to JavaScript origins and `https://<site>/__/auth/handler` to redirect URIs.
4. Firebase → Firestore → Rules: paste `firestore.rules` and publish.
5. To become admin, set `admin: true` (boolean) on your own document in the `members` collection.

The Firebase web config in `index.html` is not a secret (it ships to every browser). Access is controlled by `firestore.rules`.
