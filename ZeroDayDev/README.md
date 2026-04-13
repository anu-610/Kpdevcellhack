# Dev Cell Website — IIT Mandi

This is a full-stack website built for the Dev Cell of Kamand Prompt.
The goal was to make something more useful than just a static page — a place where people can actually see what’s happening in the club and interact.

---

## What it currently does

- Shows members of the Dev Cell
- Lists projects
- Login using institute email (Firebase auth)
- Simple real-time chat system

---

## Tech stack

Frontend:

- React (Vite)

Backend:

- Node.js + Express

Database:

- MongoDB

Other stuff:

- Firebase (auth)
- Socket.IO (chat)

---

## How to run it locally

Clone the repo:

```bash
git clone <repo-link>
cd <project-folder>
```

Install dependencies:

```bash
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

Setup env variables:

```bash
cp .env.example .env
```

Run the backend:

```bash
cd root
cd src
npm start
```

Run the frontend (in another terminal):

```bash
cd frontend
npm run dev
```

---

## Notes

- MongoDB should be running locally (or change the URI in `.env`)
- Check `.env.example` for required variables
