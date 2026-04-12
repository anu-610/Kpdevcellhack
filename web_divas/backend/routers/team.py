"""
routers/team.py — /api/team endpoints

Public:  GET /api/team         → list all members
Admin:   POST /api/team        → add a member
Admin:   PUT /api/team/{id}    → update a member
Admin:   DELETE /api/team/{id} → remove a member

Read is public (anyone can see the team page).
Writes are protected — only a verified Firebase admin can mutate data.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from database import team_collection
from models import TeamMemberCreate
from auth import get_current_admin

router = APIRouter()


def serialize(doc) -> dict:
    """
    MongoDB returns _id as ObjectId. JSON can't serialize ObjectId.
    We convert it to a string here before returning to the client.
    We keep the key as "_id" so the frontend can use it as a stable React key.
    """
    doc["_id"] = str(doc["_id"])
    return doc


# ─── Public ─────────────────────────────────────────────────────────────────

@router.get("/")
async def get_team():
    """Return all team members, sorted by name."""
    members = await team_collection.find().sort("name", 1).to_list(length=100)
    return [serialize(m) for m in members]


@router.get("/{member_id}")
async def get_member(member_id: str):
    """Return a single team member by their Mongo _id."""
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    member = await team_collection.find_one({"_id": ObjectId(member_id)})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    return serialize(member)


# ─── Admin ──────────────────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
async def add_member(member: TeamMemberCreate):
    """
    Add a new team member.
    Pydantic validates the request body before this function even runs.
    If required fields are missing, FastAPI returns 422 automatically.
    """
    result = await team_collection.insert_one(member.model_dump())
    return {"inserted_id": str(result.inserted_id)}


@router.put("/{member_id}", dependencies=[Depends(get_current_admin)])
async def update_member(member_id: str, member: TeamMemberCreate):
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await team_collection.update_one(
        {"_id": ObjectId(member_id)},
        {"$set": member.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")

    return {"updated": True}


@router.delete("/{member_id}", dependencies=[Depends(get_current_admin)])
async def delete_member(member_id: str):
    if not ObjectId.is_valid(member_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await team_collection.delete_one({"_id": ObjectId(member_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")

    return {"deleted": True}