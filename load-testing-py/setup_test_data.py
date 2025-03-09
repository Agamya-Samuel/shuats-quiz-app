import json
import time
import asyncio
import aiohttp
import argon2
from tqdm import tqdm

# Configuration
BASE_URL = "http://localhost:3000"  # Change to your application URL

async def register_user(session, user):
    """Register a user using the API"""
    url = f"{BASE_URL}/api/register"
    try:
        async with session.post(url, json=user) as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f"Failed to register user {user['email']}: {await response.text()}")
                return None
    except Exception as e:
        print(f"Error registering user {user['email']}: {str(e)}")
        return None

async def add_question(session, question, admin_token):
    """Add a question using the API"""
    url = f"{BASE_URL}/api/questions"
    headers = {"Authorization": f"Bearer {admin_token}"}
    try:
        async with session.post(url, json=question, headers=headers) as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f"Failed to add question: {await response.text()}")
                return None
    except Exception as e:
        print(f"Error adding question: {str(e)}")
        return None

async def login_admin(session):
    """Login as admin to get token for adding questions"""
    url = f"{BASE_URL}/api/login-maintainer"
    try:
        # You'll need to replace these with actual admin credentials
        credentials = {
            "username": "admin",
            "password": "admin_password"
        }
        async with session.post(url, json=credentials) as response:
            if response.status == 200:
                data = await response.json()
                return data.get("token")
            else:
                print(f"Failed to login as admin: {await response.text()}")
                return None
    except Exception as e:
        print(f"Error logging in as admin: {str(e)}")
        return None

async def setup_data():
    """Setup test data by registering users and adding questions"""
    # Load data from JSON files
    with open("load-testing/users.json", "r") as f:
        users = json.load(f)
    
    with open("load-testing/questions.json", "r") as f:
        questions = json.load(f)
    
    # Create a client session
    async with aiohttp.ClientSession() as session:
        # Register users
        print("Registering users...")
        tasks = []
        for user in users:
            tasks.append(register_user(session, user))
        
        # Use tqdm to show progress
        for f in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Registering users"):
            await f
        
        # Login as admin
        print("Logging in as admin...")
        admin_token = await login_admin(session)
        if not admin_token:
            print("Failed to login as admin. Cannot add questions.")
            return
        
        # Add questions
        print("Adding questions...")
        tasks = []
        for question in questions:
            tasks.append(add_question(session, question, admin_token))
        
        # Use tqdm to show progress
        for f in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Adding questions"):
            await f
        
        print("Setup complete!")

if __name__ == "__main__":
    asyncio.run(setup_data()) 