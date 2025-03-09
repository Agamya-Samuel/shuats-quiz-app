import json
import time
import asyncio
import aiohttp
import random
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# Configuration
BASE_URL = "http://localhost:3000"  # Change to your application URL
PHASES = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]  # Number of concurrent users per phase

async def login_user(session, user):
    """Login a user and return the cookies"""
    url = f"{BASE_URL}/api/login"
    try:
        async with session.post(url, json={"email": user["email"], "password": user["password"]}) as response:
            if response.status == 200:
                # Return the cookies from the response
                return session.cookie_jar.filter_cookies(response.url)
            else:
                print(f"Failed to login user {user['email']}: {await response.text()}")
                return None
    except Exception as e:
        print(f"Error logging in user {user['email']}: {str(e)}")
        return None

async def submit_quiz(session, user_id, questions, cookies):
    """Submit quiz answers for a user"""
    url = f"{BASE_URL}/api/submit-quiz"
    
    # Select 20 random questions to answer
    selected_questions = random.sample(questions, min(20, len(questions)))
    
    # Prepare answers
    answers = []
    for question in selected_questions:
        # Randomly select an option (simulating user behavior)
        selected_option_id = random.randint(1, 4)
        answers.append({
            "questionId": question["_id"],
            "selectedOptionId": selected_option_id
        })
    
    # Record start time
    start_time = time.time()
    
    try:
        async with session.post(url, json={"userId": user_id, "answers": answers}, cookies=cookies) as response:
            # Calculate response time
            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            if response.status == 200:
                return {
                    "success": True,
                    "response_time": response_time,
                    "user_id": user_id
                }
            else:
                return {
                    "success": False,
                    "response_time": response_time,
                    "user_id": user_id,
                    "error": await response.text()
                }
    except Exception as e:
        # Calculate response time even for errors
        response_time = (time.time() - start_time) * 1000
        return {
            "success": False,
            "response_time": response_time,
            "user_id": user_id,
            "error": str(e)
        }

async def run_phase(num_users, users, questions):
    """Run a single phase of the load test with the specified number of concurrent users"""
    # Select random users for this phase
    selected_users = random.sample(users, num_users)
    
    results = []
    
    # Create a client session
    async with aiohttp.ClientSession() as session:
        # Login all users first
        print(f"Logging in {num_users} users...")
        login_tasks = []
        for user in selected_users:
            login_tasks.append(login_user(session, user))
        
        login_results = await asyncio.gather(*login_tasks)
        
        # Filter out failed logins
        valid_users = []
        valid_cookies = []
        for i, cookies in enumerate(login_results):
            if cookies:
                valid_users.append(selected_users[i])
                valid_cookies.append(cookies)
        
        print(f"Successfully logged in {len(valid_users)} users")
        
        # Submit quizzes concurrently
        print(f"Submitting quizzes for {len(valid_users)} users simultaneously...")
        submit_tasks = []
        for i, user in enumerate(valid_users):
            submit_tasks.append(submit_quiz(session, user["_id"], questions, valid_cookies[i]))
        
        # Use tqdm to show progress
        for f in tqdm(asyncio.as_completed(submit_tasks), total=len(submit_tasks), desc=f"Phase {num_users} users"):
            result = await f
            results.append(result)
    
    return results

async def run_load_test():
    """Run the complete load test across all phases"""
    # Load data from JSON files
    with open("load-testing/users.json", "r") as f:
        users = json.load(f)
    
    with open("load-testing/questions.json", "r") as f:
        questions = json.load(f)
    
    # Add user IDs (in a real scenario, you'd get these from the database)
    for i, user in enumerate(users):
        user["_id"] = f"user_{i+1}"
    
    # Add question IDs (in a real scenario, you'd get these from the database)
    for i, question in enumerate(questions):
        question["_id"] = f"question_{i+1}"
    
    all_results = []
    
    # Run each phase
    for num_users in PHASES:
        print(f"\n=== Starting phase with {num_users} concurrent users ===")
        phase_results = await run_phase(num_users, users, questions)
        
        # Add phase information to results
        for result in phase_results:
            result["concurrent_users"] = num_users
        
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