"""
routers/events.py — /api/events endpoints

Public:  GET /api/events           → all events
Public:  GET /api/events/upcoming  → only upcoming events (is_upcoming=True)
Admin:   POST /api/events          → add event
Admin:   PUT /api/events/{id}      → update
Admin:   DELETE /api/events/{id}   → delete
"""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from database import events_collection
from models import EventCreate
from auth import get_current_admin

router = APIRouter()


def serialize(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/")
async def get_events():
    events = await events_collection.find().sort("date", -1).to_list(length=100)
    return [serialize(e) for e in events]


@router.get("/upcoming")
async def get_upcoming_events():
    """
    Filter by is_upcoming flag.
    The frontend uses this for the homepage events section — only shows
    events that haven't happened yet without loading all past events.
    """
    events = await events_collection.find({"is_upcoming": True}).sort("date", 1).to_list(length=10)
    return [serialize(e) for e in events]


@router.get("/{event_id}")
async def get_event(event_id: str):
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    event = await events_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return serialize(event)


@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
async def add_event(event: EventCreate):
    result = await events_collection.insert_one(event.model_dump())
    return {"inserted_id": str(result.inserted_id)}


@router.put("/{event_id}", dependencies=[Depends(get_current_admin)])
async def update_event(event_id: str, event: EventCreate):
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await events_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": event.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"updated": True}


@router.delete("/{event_id}", dependencies=[Depends(get_current_admin)])
async def delete_event(event_id: str):
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await events_collection.delete_one({"_id": ObjectId(event_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"deleted": True}