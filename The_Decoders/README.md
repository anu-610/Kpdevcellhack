# KP Dev Cell — Official Website

The official site of **Kammand Prompt Club**, IIT Mandi's developer club.

🌐 **Live:** [kp-devcell.vercel.app](https://kp-devcell.vercel.app)  
🔐 **Admin:** [kp-devcell.vercel.app/admin](https://kp-devcell.vercel.app/admin)

---

## What's this?

This is the full-stack web app we built for KP Dev Cell. It's not just a landing page — there's a real backend, auth, and an admin dashboard that club leads actually use day-to-day.

The site lets us:
- Show off the club, the team, and what we've built
- Post and filter events (upcoming, past, happening today)
- Share study resources like PDFs and slides, organized neatly
- Push live announcements to the homepage
- Manage everything through a protected admin panel

---

## Tech Stack

**Frontend**
- React (functional components, hooks)
- React Router (with protected + public-only route guards)
- Framer Motion (spring physics, scroll-linked animations, card stacking)
- Canvas 2D API (Matrix Rain on the homepage, floating code tokens on login)
- Fira Code + Inter (monospace for the terminal feel, Inter for readability)

**Backend**
- Node.js + Express (REST API)
- MongoDB + Mongoose

**Auth & Infra**
- Firebase Authentication (email/password, sessions, re-auth)
- Docker (containerisation)
- Vercel (frontend hosting, auto-deploys from GitHub)
- Render (backend hosting, auto-deploys from GitHub)

---

## Project Structure

```
KP-DEVCELL/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose models (Event, Member, Announcement)
│   │   └── routes/           # API routes
│   ├── index.js
│   └── Dockerfile
│
├── frontend/
│   ├── public/               # Static assets (logo, favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # Admin panel components
│   │   │   ├── home/         # Homepage sections
│   │   │   └── shared/       # Reusable components
│   │   ├── pages/            # Page-level components
│   │   ├── context/          # Auth context
│   │   ├── hooks/            # Custom hooks
│   │   ├── constants/        # Theme tokens
│   │   └── utils/
│   ├── index.html
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## Pages & Features

Every page has its own loading animation, but they all share the same dark, terminal-inspired look.

**Homepage**
- Boot loader with a fake terminal session and step-by-step log
- Matrix Rain canvas in the hero section
- Live announcements as terminal-window cards (desktop) or a scrolling ticker (mobile)
- Typewriter effect cycling through club mottos
- Scroll-triggered text scramble effects and stat counters (members, projects, sessions)
- 3D-stacked project cards that flip on scroll

**Core Team**
- Member cards styled as macOS terminal windows
- Desktop: cards fan out with spring-physics on hover
- Mobile: horizontal swipe scroll with snap

**Events**
- Radar-style boot loader (unique to this page)
- Header types out `ls -la ./events` on load
- Horizontal cards with a date column and a pulsing status dot (upcoming / today / past)
- Filter tabs with live event counts

**Resources**
- Document-scanner boot loader animation
- GitHub-style file explorer layout
- Accordion folder cards with tree-connector lines
- PDF and PPT badges with colour coding

**Admin Dashboard** *(protected — [kp-devcell.vercel.app/admin](https://kp-devcell.vercel.app/admin))*
- VS Code–style layout: top bar, left sidebar, tab bar
- Live clock and `root@kp-admin` status chip in the top bar
- Manage members, events, announcements, and admin access
- Smooth fade-slide transitions between tabs
- Collapsible sidebar on mobile with a hamburger toggle

**Login Page**
- Background canvas with 240 floating code tokens (`const`, `async`, `===`, etc.)
- Frosted-glass login card with a teal scanline animation
- Custom animated SVG logo (bracket + two orbiting dots)
- Glow-on-focus inputs
- Login and Set Password modes with an animated transition between them

---

## Auth Flow

- `/admin` — protected route, redirects to `/login` if not authenticated
- `/login` — public-only, redirects to `/admin` if already logged in
- Auth state managed via `AuthContext` using Firebase
- Supports password change for first-time users

---

## Design System

All theme values live in `src/constants/theme.js`:

```js
export const C = {
  bg:     '#0d1117',   // page background
  card:   '#161b22',   // card/surface background
  border: '#21262d',   // borders
  fg:     '#e6edf3',   // primary text
  muted:  '#7d8590',   // secondary text
  cyan:   '#14b8a6',   // primary accent
  purple: '#a855f7',   // secondary accent
}
```

Body text uses **Inter**. Everything terminal-flavoured uses **Fira Code / Cascadia Code**.

---

Built by DeCoders — KP Dev Cell, IIT Mandi.