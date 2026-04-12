"""
routers/projects.py — /api/projects endpoints

Public:  GET /api/projects        → list all projects
Admin:   POST /api/projects       → add a project
Admin:   PUT /api/projects/{id}   → update
Admin:   DELETE /api/projects/{id}→ delete
"""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from database import projects_collection
from models import ProjectCreate
from auth import get_current_admin

router = APIRouter()


def serialize(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/")
async def get_projects():
    """Return all projects, newest first (by Mongo's natural insert order)."""
    projects = await projects_collection.find().sort("_id", -1).to_list(length=100)
    return [serialize(p) for p in projects]


@router.get("/{project_id}")
async def get_project(project_id: str):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    project = await projects_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return serialize(project)


@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
async def add_project(project: ProjectCreate):
    result = await projects_collection.insert_one(project.model_dump())
    return {"inserted_id": str(result.inserted_id)}


@router.put("/{project_id}", dependencies=[Depends(get_current_admin)])
async def update_project(project_id: str, project: ProjectCreate):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": project.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"updated": True}


@router.delete("/{project_id}", dependencies=[Depends(get_current_admin)])
async def delete_project(project_id: str):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await projects_collection.delete_one({"_id": ObjectId(project_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"deleted": True}