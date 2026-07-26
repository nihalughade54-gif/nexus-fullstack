# NEXUS — Full-Stack E-Commerce Store

A complete e-commerce site built with **React** (frontend), **Node.js + Express** (backend API), and plain **HTML/CSS** (no CSS framework — a hand-built design system).

---

## 📁 What's inside

```
nexus-fullstack/
├── backend/     ← Node.js + Express API (products, auth, orders)
└── frontend/    ← React + Vite website (what the user sees)
```

The frontend talks to the backend over HTTP. You run **both** at the same time — one in each terminal tab.

---

## ▶️ How to run it (simple steps)

**Requirement:** [Node.js](https://nodejs.org) installed (version 18 or newer). Check with `node -v`.

### 1. Start the backend (the API)

Open a terminal:

```bash
cd nexus-fullstack/backend
npm install
npm start
```

You should see:
```
NEXUS API running at http://localhost:5000
```

Leave this terminal running.

### 2. Start the frontend (the website)

Open a **second** terminal (don't close the first one):

```bash
cd nexus-fullstack/frontend
npm install
npm run dev
```

You'll see a line like:
```
➜  Local:   http://localhost:5173/
```

### 3. Open the site

Go to **http://localhost:5173** in your browser. That's it — browse products, create an account, add items to your cart, and check out.

---

## What each part does

| Part | Technology | Job |
|---|---|---|
| `frontend/` | React + Vite, HTML, CSS | The website UI — pages, cart, product grid |
| `backend/` | Node.js + Express | API that serves products, handles signup/login, and creates orders |
| `backend/data/db/` | JSON files (auto-created) | Stores users and orders — created the first time you sign up |

## Features

- **Product catalog** — 16 real, recognizable products (Apple, Sony, Nike, Samsung, Dell, etc.) served from the backend, with search/filter/sort handled server-side
- **User authentication** — real signup/login against the Node API, passwords hashed with bcrypt, sessions handled with JWT tokens
- **Shopping cart** — slide-in cart drawer, persists in the browser
- **Checkout & payment** — shipping form + card form; the backend validates the order, recalculates the total from its own price list (never trusts the browser's numbers), and returns a confirmed order
- **Protected checkout** — you must be logged in to check out

## Important notes

- **Payments are simulated.** The backend accepts card details, validates their format, and "confirms" the order — but no real bank or card network is contacted. To accept real payments, add a call to a provider like Stripe from `backend/routes/orders.js` (see the comment in that file) using Stripe Elements on the frontend instead of the raw card inputs, since PCI compliance requires that raw card numbers never touch your own server.
- **The "database" is JSON files** in `backend/data/db/`, created automatically the first time someone signs up. This is fine for learning/demo purposes. For production, swap it for a real database (PostgreSQL, MongoDB, etc.).
- **Product photos** are generic stock placeholders (picsum.photos), not real product photography — swap them out before using this publicly.

## Troubleshooting

- **"Couldn't load products" on the site** → the backend isn't running. Go back to Step 1.
- **Port already in use** → something else is using port 5000 or 5173. Stop that process, or change `PORT` in `backend/.env`.
- **Signed up but it says "already exists"** → someone (maybe you, in an earlier test) already signed up with that email. Try logging in instead, or use a different email.
