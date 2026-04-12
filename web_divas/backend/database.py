"""
database.py — MongoDB connection via Motor (async driver)
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:devcelliitmandi@mongo:27017/kpdevcel?authSource=admin")

client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client["kpdevcel"]

team_collection = db["team"]
projects_collection = db["projects"]
events_collection = db["events"]
