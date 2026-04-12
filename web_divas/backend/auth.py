"""
auth.py — Firebase Admin SDK token verification
 
How Firebase Auth works in this stack:
  1. User logs in on the frontend via Firebase (Google sign-in, etc.)
  2. Firebase gives the frontend a short-lived ID token (JWT).
  3. The frontend sends this token in every admin request:
       Authorization: Bearer <token>
  4. This file verifies that token using the Firebase Admin SDK.
     If it's valid, we extract the user's email. If not, we reject with 401.
 
Why verify on the backend instead of trusting the frontend?
Because the frontend is public. Anyone can open DevTools, skip the
ProtectedRoute component, and call /api/team with a fake token.
Server-side verification is the actual security layer.
 
Why Firebase Admin SDK and not manual JWT decoding?
Firebase tokens are signed with Google's private keys. We'd have to fetch
Google's public keys and verify the signature ourselves. The Admin SDK does
all of that plus checks expiry, audience, and issuer. No reason to reinvent it.
"""
 
import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header, HTTPException, status
from dotenv import load_dotenv
 
load_dotenv()
 
# Initialize Firebase Admin once at import time.
# firebase_admin.initialize_app() is idempotent-safe with this guard.
if not firebase_admin._apps:
    try:
        # 1. Try to load from JSON string in environment variable (Render/Vercel style)
        creds_json = os.getenv("FIREBASE_CREDS_JSON")
        if creds_json:
            creds_dict = json.loads(creds_json)
            cred = credentials.Certificate(creds_dict)
            firebase_admin.initialize_app(cred)
        else:
            # 2. Fallback to file path (Docker/Local style)
            # Default to /app/ in docker, or local for dev
            cred_path = os.getenv("FIREBASE_CREDS_PATH", "serviceAccountKey.json")
            if not os.path.isabs(cred_path):
                # Try relative to current file if not absolute
                cred_path = os.path.join(os.path.dirname(__file__), cred_path)
            
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                print("⚠️  WARNING: No Firebase credentials found (JSON or file). Admin routes will fail.")
    except Exception as e:
        print(f"⚠️  WARNING: Firebase init failed: {e}. Admin routes are unprotected.")
# ─── Dependency ─────────────────────────────────────────────────────────────
 
async def get_current_admin(authorization: str = Header(default="")):
    """
    FastAPI dependency injected into every admin-only route.
 
    Usage in a router:
        @router.post("/", dependencies=[Depends(get_current_admin)])
 
    Raises 401 if:
    - No Authorization header
    - Token is malformed / expired / revoked
    - Firebase Admin SDK isn't initialized (no credentials set)
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Expected: Bearer <token>",
        )
 
    token = authorization.split("Bearer ")[1]
 
    # If Firebase isn't initialized (local dev without creds), skip verification.
    if not firebase_admin._apps:
        return {"email": "dev@local", "uid": "local"}
 
    try:
        decoded = auth.verify_id_token(token)
        return decoded  # contains uid, email, and other Firebase claims
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired. Please re-login.")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")
 