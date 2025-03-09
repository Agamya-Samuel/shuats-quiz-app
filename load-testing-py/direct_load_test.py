import json
import time
import asyncio
import random
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
from pymongo import MongoClient
import argon2
from bson import ObjectId
from datetime import datetime

# Configuration
MONGODB_URI = "mongodb://localhost:27017/quiz_app"  # Change to your MongoDB URI
DB_NAME = "quiz_app"  # Change to your database name
PHASES = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]  # Number of concurrent users per phase

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def generate_and_insert_questions(num_questions=500):
    """Generate and insert random questions into the database"""
    from faker import Faker
    fake = Faker()
    
    SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
    
    # Clear existing questions and answers
    db.questions.delete_many({})
    db.correctanswers.delete_many({})
    
    questions = []
    correct_answers = []
    
    for i in range(num_questions):
        # Create question
        question_id = ObjectId()
        
        # Create 4 unique options
        options = []
        for j in range(4):
            option_text = fake.sentence(nb_words=random.randint(3, 8)).rstrip('.')
            options.append({"id": j+1, "text": option_text})
        
        # Select a random correct option
        correct_option_id = random.randint(1, 4)
        
        # Create the question document
        question = {
            "_id": question_id,
            "text": fake.sentence(nb_words=random.randint(8, 15)),
            "options": options,
            "subject": random.choice(SUBJECTS)
        }
        
        # Create the correct answer document
        correct_answer = {
            "questionId": question_id,
            "correctOptionId": correct_option_id
        }
        
        questions.append(question)
        correct_answers.append(correct_answer)
    
    # Insert questions and answers in bulk
    if questions:
        db.questions.insert_many(questions)
    if correct_answers:
        db.correctanswers.insert_many(correct_answers)
    
    print(f"Inserted {len(questions)} questions and correct answers")
    return [q["_id"] for q in questions]

def generate_and_insert_users(num_users=500):
    """Generate and insert random users into the database"""
    from faker import Faker
    fake = Faker()
    
    # Clear existing users
    db.users.delete_many({})
    
    users = []
    
    for i in range(num_users):
        user_id = ObjectId()
        first_name = fake.first_name()
        last_name = fake.last_name()
        name = f"{first_name} {last_name}"
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
        
        # Hash password
        password = "Password123!"
        hasher = argon2.PasswordHasher()
        hashed_password = hasher.hash(password)
        
        user = {
            "_id": user_id,
            "name": name,
            "email": email,
            "password": hashed_password,
            "mobile": fake.phone_number()[:10],
            "rollNo": f"R{random.randint(10000, 99999)}",
            "schoolName": fake.company() + " University",
            "branch": random.choice(["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]),
            "address": fake.address().replace('\n', ', ')
        }
        
        users.append(user)
    
    # Insert users in bulk
    if users:
        db.users.insert_many(users)
    
    print(f"Inserted {len(users)} users")
    return [u["_id"] for u in users]

async def submit_quiz_answers(user_id, question_ids, num_questions=20):
    """Simulate submitting quiz answers directly to the database"""
    # Select random questions
    selected_question_ids = random.sample(question_ids, min(num_questions, len(question_ids)))
    
    # Get start time
    start_time = datetime.now()
    
    # Prepare answers
    answers = []
    for question_id in selected_question_ids:
        # Randomly select an option
        selected_option_id = random.randint(1, 4)
        
        answer = {
            "questionId": question_id,
            "userId": user_id,
            "selectedOptionId": selected_option_id,
            "startTime": start_time,
            "submittedAt": datetime.now(),
            "timeTakenSeconds": random.randint(30, 300)  # Random time between 30s and 5min
        }
        
        answers.append(answer)
    
    # Record start time for performance measurement
    perf_start_time = time.time()
    
    try:
        # Insert answers in bulk
        result = db.submittedanswers.insert_many(answers)
        
        # Calculate response time
        response_time = (time.time() - perf_start_time) * 1000  # Convert to milliseconds
        
        return {
            "success": True,
            "response_time": response_time,
            "user_id": str(user_id),
            "num_answers": len(answers)
        }
    except Exception as e:
        # Calculate response time even for errors
        response_time = (time.time() - perf_start_time) * 1000
        
        return {
            "success": False,
            "response_time": response_time,
            "user_id": str(user_id),
            "error": str(e)
        }

async def run_phase(num_users, user_ids, question_ids):
    """Run a single phase of the load test with the specified number of concurrent users"""
    # Select random users for this phase
    selected_user_ids = random.sample(user_ids, num_users)
    
    # Create tasks for concurrent quiz submissions
    tasks = []
    for user_id in selected_user_ids:
        tasks.append(submit_quiz_answers(user_id, question_ids))
    
    # Execute tasks concurrently
    results = []
    for f in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc=f"Phase {num_users} users"):
        result = await f
        result["concurrent_users"] = num_users
        results.append(result)
    
    return results

async def run_load_test():
    """Run the complete load test across all phases"""
    # Generate test data
    print("Generating test data...")
    question_ids = generate_and_insert_questions(500)
    user_ids = generate_and_insert_users(500)
    
    all_results = []
    
    # Run each phase
    for num_users in PHASES:
        print(f"\n=== Starting phase with {num_users} concurrent users ===")
        
        # Clear existing submitted answers before each phase
        db.submittedanswers.delete_many({})
        
        phase_results = await run_phase(num_users, user_ids, question_ids)
        all_results.extend(phase_results)
        
        # Brief pause between phases
        print(f"Phase with {num_users} users completed. Pausing before next phase...")
        await asyncio.sleep(5)
    
    return all_results

def analyze_results(results):
    """Analyze and visualize the load test results"""
    # Convert results to DataFrame
    df = pd.DataFrame(results)
    
    # Group by phase (number of concurrent users)
    grouped = df.groupby("concurrent_users")["response_time"]
    
    # Calculate statistics
    stats = grouped.agg(["min", "max", "mean", "median", "count"]).reset_index()
    
    print("\n=== Load Test Results ===")
    print(stats)
    
    # Save statistics to CSV
    stats.to_csv("load-testing/results.csv", index=False)
    print("Results saved to results.csv")
    
    # Create visualizations
    plt.figure(figsize=(12, 8))
    
    # Line plot for min, max, and average response times
    plt.subplot(2, 1, 1)
    plt.plot(stats["concurrent_users"], stats["min"], marker='o', label="Min Time")
    plt.plot(stats["concurrent_users"], stats["mean"], marker='o', label="Avg Time")
    plt.plot(stats["concurrent_users"], stats["max"], marker='o', label="Max Time")
    plt.xlabel("Concurrent Users")
    plt.ylabel("Response Time (ms)")
    plt.title("Response Times vs. Concurrent Users")
    plt.legend()
    plt.grid(True)
    
    # Box plot for response time distribution
    plt.subplot(2, 1, 2)
    sns.boxplot(x="concurrent_users", y="response_time", data=df)
    plt.xlabel("Concurrent Users")
    plt.ylabel("Response Time (ms)")
    plt.title("Response Time Distribution by Concurrent Users")
    
    plt.tight_layout()
    plt.savefig("load-testing/response_times.png")
    print("Visualization saved to response_times.png")
    
    # Create a heatmap of success rate
    success_rate = df.groupby("concurrent_users")["success"].mean().reset_index()
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x="concurrent_users", y="success", data=success_rate)
    plt.xlabel("Concurrent Users")
    plt.ylabel("Success Rate")
    plt.title("Success Rate by Concurrent Users")
    plt.ylim(0, 1)
    plt.grid(True, axis='y')
    plt.savefig("load-testing/success_rate.png")
    print("Success rate visualization saved to success_rate.png")

if __name__ == "__main__":
    # Run the load test
    results = asyncio.run(run_load_test())
    
    # Analyze and visualize the results
    analyze_results(results) 