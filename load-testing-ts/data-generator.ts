import { connectToDB } from '@/db';
import Question from '@/db/models/question';
import CorrectAnswer from '@/db/models/correct-answer';
import User from '@/db/models/user';
import argon2 from 'argon2';
import fs from 'fs/promises';
import path from 'path';

// Subjects for questions
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

// Generate a random question
function generateRandomQuestion(index: number) {
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const questionText = `Test Question ${index}: What is the correct answer for ${subject} question number ${index}?`;
  
  // Generate 4 options
  const options = [
    { id: 1, text: `Option A for question ${index}` },
    { id: 2, text: `Option B for question ${index}` },
    { id: 3, text: `Option C for question ${index}` },
    { id: 4, text: `Option D for question ${index}` }
  ];
  
  // Randomly select correct option
  const correctOptionId = Math.floor(Math.random() * 4) + 1;
  
  return {
    question: {
      text: questionText,
      options,
      subject
    },
    correctOptionId
  };
}

// Generate a random user
function generateRandomUser(index: number) {
  return {
    name: `Test User ${index}`,
    email: `testuser${index}@example.com`,
    password: 'Password123!',
    mobile: `98765${String(index).padStart(5, '0')}`,
    rollNo: `ROLL${String(index).padStart(5, '0')}`,
    schoolName: `Test School ${Math.floor(index / 50)}`,
    branch: `Branch ${Math.floor(index / 100)}`,
    address: `Test Address ${index}, Test City`
  };
}

// Generate and save test data
export async function generateTestData() {
  console.log('Generating test data...');
  
  try {
    await connectToDB();
    
    // Check if data already exists
    const questionCount = await Question.countDocuments();
    const userCount = await User.countDocuments();
    
    // Create results directory if it doesn't exist
    const resultsDir = path.join(process.cwd(), 'load-testing', 'results');
    await fs.mkdir(resultsDir, { recursive: true });
    
    // Generate questions if needed
    if (questionCount < 500) {
      console.log('Generating questions...');
      
      const questionsToAdd = 500 - questionCount;
      const batchSize = 50;
      
      for (let i = 0; i < questionsToAdd; i += batchSize) {
        const questionBatch = [];
        const correctAnswerBatch = [];
        
        for (let j = 0; j < batchSize && i + j < questionsToAdd; j++) {
          const { question, correctOptionId } = generateRandomQuestion(questionCount + i + j + 1);
          
          const newQuestion = new Question(question);
          await newQuestion.save();
          
          const newCorrectAnswer = new CorrectAnswer({
            questionId: newQuestion._id,
            correctOptionId
          });
          await newCorrectAnswer.save();
          
          console.log(`Created question ${i + j + 1}/${questionsToAdd}`);
        }
      }
      
      console.log(`Generated ${questionsToAdd} questions`);
    } else {
      console.log(`Using existing ${questionCount} questions`);
    }
    
    // Generate users if needed
    if (userCount < 500) {
      console.log('Generating users...');
      
      const usersToAdd = 500 - userCount;
      const batchSize = 50;
      
      for (let i = 0; i < usersToAdd; i += batchSize) {
        const userBatch = [];
        
        for (let j = 0; j < batchSize && i + j < usersToAdd; j++) {
          const userData = generateRandomUser(userCount + i + j + 1);
          
          // Hash password
          const hashedPassword = await argon2.hash(userData.password);
          
          const newUser = new User({
            ...userData,
            password: hashedPassword
          });
          
          await newUser.save();
          console.log(`Created user ${i + j + 1}/${usersToAdd}`);
        }
      }
      
      console.log(`Generated ${usersToAdd} users`);
    } else {
      console.log(`Using existing ${userCount} users`);
    }
    
    // Save user credentials for testing
    const testUsers = await User.find({}, { _id: 1, email: 1 })
      .limit(500)
      .lean();
    
    await fs.writeFile(
      path.join(resultsDir, 'test-users.json'),
      JSON.stringify(testUsers, null, 2)
    );
    
    console.log('Test data generation completed');
    
  } catch (error) {
    console.error('Error generating test data:', error);
    throw error;
  }
} 