# 🎮 Jugando

A video game catalog SPA built with React. Browse thousands of games via the RAWG API, sign up with a real account through Firebase Authentication, and save your favorites to the cloud with Firestore.

**🔗 Live demo:** [jugando-hazel.vercel.app](https://jugando-hazel.vercel.app)

---

## Features

- 🔐 **Authentication** — sign up and log in with email/password via Firebase Auth
- 🕹️ **Game catalog** — browse a large library of games fetched from the RAWG Video Games Database API
- 🔍 **Search & filters** — debounced search by title, plus filtering by genre and platform
- ⭐ **Favorites** — save games to a personal favorites list, stored in Firestore and synced across devices
- 📄 **Game details** — view full details (description, screenshots, platforms, release date, rating) in a modal or a dedicated page
- 🌍 **Multilanguage** — full UI translation in Russian, English, and Spanish
- 📱 **Responsive design** — adapted for mobile, tablet, and desktop
- 🎨 **Custom UI** — animated floating mascot, video background, smooth hover transitions

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Routing:** React Router
- **Auth & Database:** Firebase (Authentication, Firestore)
- **Game data:** [RAWG Video Games Database API](https://rawg.io/apidocs)
- **Localization:** react-i18next
- **Deployment:** Vercel

---

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/segamania90-crypto/jugando.git
cd jugando
npm install
```

Create a `.env` file in the root directory based on `.env.example`, and fill in your own RAWG and Firebase credentials:

```
VITE_RAWG_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Run the development server:

```bash
npm run dev
```

---

## Project Structure

```
src/
├── api/          # RAWG API request functions
├── components/   # Reusable UI components
├── hooks/        # Custom hooks (auth, favorites)
├── locales/      # Translation files (ru, en, es)
├── pages/        # Route-level pages
├── firebase.js   # Firebase config
└── i18n.js       # Localization config
```

---

## Author

Built as a portfolio project — third in a series progressing from static HTML/CSS, to vanilla JavaScript, to a full React application with real authentication and cloud storage.
