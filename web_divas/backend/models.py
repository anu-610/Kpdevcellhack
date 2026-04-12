from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


# ─── Team Member ────────────────────────────────────────────────────────────

class TeamMemberCreate(BaseModel):
    name: str
    role: Optional[str] = "member"
    position: Optional[str] = ""
    bio: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    year: Optional[str] = ""
    branch: Optional[str] = ""
    skills: List[str] = []
    photo_url: Optional[str] = ""

class TeamMemberResponse(TeamMemberCreate):
    id: str = Field(alias="_id")
    class Config:
        populate_by_name = True


# ─── Project ────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    stack: List[str] = []
    tech_stack: List[str] = []
    github: Optional[str] = ""
    github_url: Optional[str] = ""
    live: Optional[str] = ""
    live_url: Optional[str] = ""
    thumbnail_url: Optional[str] = ""
    team_members: List[str] = []
    year: Optional[str] = ""

class ProjectResponse(ProjectCreate):
    id: str = Field(alias="_id")
    class Config:
        populate_by_name = True


# ─── Event ──────────────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    name: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    date: Optional[str] = ""
    venue: Optional[str] = ""
    type: Optional[str] = "other"
    banner_url: Optional[str] = ""
    registration_link: Optional[str] = ""
    is_upcoming: bool = True

class EventResponse(EventCreate):
    id: str = Field(alias="_id")
    class Config:
        populate_by_name = True