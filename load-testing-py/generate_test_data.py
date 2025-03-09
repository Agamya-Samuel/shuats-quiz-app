import json
import random
import string
import argon2
import requests
from faker import Faker

fake = Faker()

# Configuration
BASE_URL = "http://localhost:3000"  # Change to your application URL
SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]

def generate_random_questions(num_questions=500):
    """Generate random quiz questions with options and correct answers"""
    questions = []
    
    for i in range(num_questions):
        # Create 4 unique options
        options = []
        for j in range(4):
            option_text = fake.sentence(nb_words=random.randint(3, 8)).rstrip('.')
            options.append({"id": j+1, "text": option_text})
        
        # Select a random correct option
        correct_option_id = random.randint(1, 4)
        
        # Create the question
        question = {
            "text": fake.sentence(nb_words=random.randint(8, 15)),
            "options": options,
            "correctOptionId": correct_option_id,
            "subject": random.choice(SUBJECTS)
        }
        
        questions.append(question)
    
    return questions

def generate_random_users(num_users=500):
    """Generate random user data for registration"""
    users = []
    
    for i in range(num_users):
        first_name = fake.first_name()
        last_name = fake.last_name()
        name = f"{first_name} {last_name}"
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
        
        user = {
            "name": name,
            "email": email,
            "password": "Password123!",  # Simple password for testing
            "mobile": fake.phone_number()[:10],
            "rollNo": f"R{random.randint(10000, 99999)}",
            "schoolName": fake.company() + " University",
            "branch": random.choice(["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]),
            "address": fake.address().replace('\n', ', ')
        }
        
        users.append(user)
    
    return users

def save_to_json(data, filename):
    """Save data to a JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

def main():
    # Generate questions
    print("Generating random questions...")
    questions = generate_random_questions(500)
    save_to_json(questions, "load-testing/questions.json")
    print(f"Generated {len(questions)} questions and saved to questions.json")
    
    # Generate users
    print("Generating random users...")
    users = generate_random_users(500)
    save_to_json(users, "load-testing/users.json")
    print(f"Generated {len(users)} users and saved to users.json")

if __name__ == "__main__":
    main() 