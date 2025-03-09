import json
import random
from locust import HttpUser, task, between

# Load test data
with open("load-testing/users.json", "r") as f:
    USERS = json.load(f)

with open("load-testing/questions.json", "r") as f:
    QUESTIONS = json.load(f)

class QuizUser(HttpUser):
    wait_time = between(1, 5)  # Wait between 1-5 seconds between tasks
    
    def on_start(self):
        """Setup before starting tests"""
        # Select a random user
        self.user = random.choice(USERS)
        
        # Login
        response = self.client.post(
            "/api/login",
            json={
                "email": self.user["email"],
                "password": "Password123!"  # Using the same password for all test users
            }
        )
        
        # Check if login was successful
        if response.status_code != 200:
            print(f"Login failed for user {self.user['email']}")
    
    @task
    def take_quiz(self):
        """Simulate taking a quiz"""
        # Select 20 random questions
        selected_questions = random.sample(QUESTIONS, min(20, len(QUESTIONS)))
        
        # Prepare answers
        answers = []
        for question in selected_questions:
            # Randomly select an option
            selected_option_id = random.randint(1, 4)
            answers.append({
                "questionId": question["_id"],
                "selectedOptionId": selected_option_id
            })
        
        # Submit the quiz
        self.client.post(
            "/api/submit-quiz",
            json={
                "userId": self.user["_id"],
                "answers": answers
            }
        ) 