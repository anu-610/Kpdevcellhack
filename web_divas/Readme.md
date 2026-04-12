#KP Dev Cell

This is the official website of KP Dev cell which is built by Ritika and Shreya during a week time duration. What all technological stacks we have used are mentioned below: Frontend: React + Vite Backend: FastAPI (Python) Database: MongoDB (Motor async driver) Auth: Firebase (Google OAuth) Containerization: Docker + Docker Compose Reverse Proxy: nginx Deployment: Railway

Why we prefered these tech stacks??

mongodb>>sql:As mentioned in the session by the core members, MONGO is more flexible than SQL as our data is more like a document which would be difficult to store in just tables so MONGODB stores it naturally.

Docker :OEverything gets synchronised and gets started in one command. Frontend, backend, MongoDB and nginx all together with docker compose up. nginx as reverse proxy: To prevent the CORS issue FastAPI:We know to implement codes in python more easily(most genuine) Firebase for auth: Firebase gives us Google OAuth in a few lines of code with proper token verification on the backend using Firebase Admin SDK.

Features: Public Pages

Home : landing page with dynamic stats (member count, project count, event count) fetched live from the database.If the admin add members or projects or events the live numbers on the home screen will chhange.

Team : displays all club members with their role,position, bio, github and linkedin links Projects: shows all club projects with tech stack badges, github and live links Events: lists all events with date, venue, type and description.

Filter between upcoming and past events Auth Firebase is providing Google OAuth which also allows access of admin panel to admins only Every admin API request sends a Firebase ID token in the Authorization header Backend verifies the token using Firebase Admin SDK before allowing any write operation Unauthenticated requests get a 401 response

Admin Panel:A person cant make any changes until he/she is an admin and authenticated. MANAGE TEAM OPTION: We can add new members with name, position,task to do,github url,tech stack,linkedin url etc.Removing members is also an option. MANAGE PROJECTS OPTION: add projects with name, description, tech stack, github url, live url.Remove existing projects. MANAGE EVENTS OPTION: create events with name, type, date, venue, description. Delete existing events All changes reflect on public pages instantly

Infrastructure Whole of the project is connected and docker is used. There are basically 4 containers each one for frontend,backend,MONGODB,nginx. The project is architected as a set of interconnected Docker services: frontend: Vite-built React application. backend: FastAPI server implementing the REST API. mongo: Local database (Docker) or managed instance (Cloud). nginx: Single entry point handling reverse-proxying.

Cloud Hosting This portal is designed to be hosted on Vercel and Render

Frontend (Vercel): Point to the frontend/ directory. Auto-detects Vite. Backend (Render): Deploy as a Web Service from the backend/ directory. Database: Use a managed MongoDB service

Environment Variables Backend MONGO_URI: Connection for MongoDB. FIREBASE_CREDS_JSON FIREBASE_CREDS_PATH

Frontend (Vite) VITE_API_BASE_URL: The URL of my deployed backend. VITE_FIREBASE_API_KEY: Firebase web configuration. VITE_FIREBASE_AUTH_DOMAIN:other Firebase config keys.

Deployment: Live Link https://shreya-mauve.vercel.app

Contributors Ritika (EE 1st Year): Backend Architecture, MongoDB, Docker, Firebase Admin,Backend deployment on render. Shreya(MnC 1st Year): Frontend UI/UX, Docker,Admin Dashboard, Responsive Layouts,frontend deployment on versel.
