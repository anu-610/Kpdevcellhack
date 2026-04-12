"""
main.py — FastAPI application entry point
 
This file does three things only:
  1. Creates the FastAPI app instance
  2. Registers CORS middleware
  3. Mounts all routers under /api
 
Why keep it this thin?
Separation of concerns. Business logic lives in routers/, DB logic in database.py,
auth logic in auth.py. main.py is just the wiring. If you open this file and
something is wrong with team data, you know to look elsewhere.
 
CORS note:
In production (behind nginx), requests from the frontend hit nginx which
reverse-proxies to the backend — same origin, so CORS isn't needed. We still
configure it here for local development where frontend (port 5173) and backend
(port 8000) run on different ports.
"""
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import team, projects, events
 
app = FastAPI(
    title="KP Dev Cell API",
    description="Backend for the official KP Dev Cell website — Kammand Prompt Club, IIT Mandi",
    version="1.0.0",
)
 
# ─── CORS ───────────────────────────────────────────────────────────────────
# Allow requests from Vite dev server in local development.
# In Docker + nginx, this middleware is effectively bypassed since both
# services are behind the same nginx origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://shreya-mauve.vercel.app",
        "https://shreya-vailism.vercel.app",
        "https://shreya-mauve-vailisms-projects.vercel.app",
        "https://shreya-18anaav3s-vailisms-projects.vercel.app",
        "https://shreya-git-main-vailisms-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
 
# ─── Routers ────────────────────────────────────────────────────────────────
# Each router owns its own prefix. Adding a new resource = adding one line here.
app.include_router(team.router, prefix="/api/team", tags=["Team"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
 
 
# ─── Health check ───────────────────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
async def health():
    """
    Used by Docker and nginx to verify the backend is up.
    Returns 200 with a simple payload — enough to confirm the app started
    and the event loop is running.
    """
    return {"status": "ok", "service": "kp-dev-cell-api"}