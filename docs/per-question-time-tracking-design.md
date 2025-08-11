# Per-Question Time Tracking Design

## Overview
Design a system to track time spent on each question using combination of user_id and question_id.

## Database Schema (Already Exists)
```sql
-- userSubmissions table already has totalTimeSpent field
CREATE TABLE user_submissions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  option TEXT NOT NULL,
  total_time_spent INTEGER DEFAULT 0  -- in seconds
);

-- Index for efficient lookups
CREATE INDEX user_question_idx ON user_submissions(user_id, question_id);
```

## Client-Side Tracking Strategy

### 1. Question Time Tracking State
```typescript
interface QuestionTimeTracker {
  questionId: number;
  startTime: Date;
  totalTime: number; // accumulated time in seconds
}

// State management
const [currentQuestionTracker, setCurrentQuestionTracker] = useState<QuestionTimeTracker | null>(null);
const [questionTimeMap, setQuestionTimeMap] = useState<Map<number, number>>(new Map());
```

### 2. Time Tracking Events

#### A. Question View Start
- Triggered when: User navigates to a question
- Action: Record start time for current question
- Storage: localStorage + component state

#### B. Question View End  
- Triggered when: User navigates away from question, submits quiz, or page unloads
- Action: Calculate elapsed time, update total time
- Storage: Update localStorage + send to server

#### C. Page Refresh/Reload
- Triggered when: Page loads
- Action: Restore time tracking state from localStorage
- Storage: Load from localStorage

### 3. Persistence Strategy

#### Client-Side (localStorage)
```typescript
// Store per-question time data
interface QuestionTimeData {
  questionId: number;
  totalTimeSpent: number;
  lastStartTime?: string; // ISO string
}

// localStorage keys
const QUESTION_TIMES_KEY = 'quiz_question_times';
const CURRENT_QUESTION_KEY = 'quiz_current_question_tracker';
```

#### Server-Side (Database)
- Update `totalTimeSpent` in `userSubmissions` table
- Use upsert pattern: update if exists, insert if not
- Batch updates for performance

## Implementation Plan

### Phase 1: Basic Time Tracking
1. Add question time tracking hooks
2. Track start/end times for each question
3. Store in localStorage for persistence
4. Update database on question change

### Phase 2: Advanced Features
1. Handle page refresh/reload scenarios
2. Add time validation (prevent manipulation)
3. Implement batch updates for performance
4. Add analytics and reporting

### Phase 3: Optimization
1. Debounce database updates
2. Add offline support
3. Implement time drift correction
4. Add detailed analytics

## Technical Considerations

### 1. Accuracy
- Use `performance.now()` for high precision timing
- Handle clock changes and system sleep
- Validate reasonable time ranges

### 2. Performance
- Batch database updates
- Debounce frequent updates
- Use efficient data structures

### 3. Security
- Server-side validation of time data
- Prevent time manipulation
- Audit trail for suspicious patterns

### 4. Edge Cases
- Page refresh during question viewing
- Browser tab switching
- Network connectivity issues
- Multiple browser tabs

## Data Flow

### Question Navigation Flow
```
1. User clicks "Next Question"
2. Stop timer for current question
3. Calculate elapsed time
4. Update localStorage
5. Send time update to server
6. Start timer for new question
7. Update UI
```

### Page Refresh Flow
```
1. Page loads
2. Restore question times from localStorage
3. Check if user was viewing a question
4. Resume timing if applicable
5. Sync with server data
```

### Quiz Submission Flow
```
1. User submits quiz
2. Stop timer for current question
3. Calculate final elapsed time
4. Update localStorage
5. Send all time data to server
6. Clear localStorage
7. Redirect to completion
```

## API Endpoints

### Update Question Time
```typescript
POST /api/quiz/question-time
{
  userId: number;
  questionId: number;
  timeSpent: number; // seconds to add
}
```

### Get Question Times
```typescript
GET /api/quiz/question-times/:userId
Response: {
  questionTimes: Array<{
    questionId: number;
    totalTimeSpent: number;
  }>;
}
```

## Monitoring & Analytics

### Metrics to Track
- Average time per question
- Time distribution across subjects
- Questions with highest/lowest time
- User behavior patterns

### Reporting Features
- Per-question time analysis
- Subject-wise time breakdown
- User performance insights
- Cheating detection patterns

## Implementation Priority

1. **High Priority**: Basic time tracking with localStorage persistence
2. **Medium Priority**: Server-side updates and validation
3. **Low Priority**: Advanced analytics and reporting

This design ensures accurate time tracking while maintaining performance and handling edge cases effectively.
