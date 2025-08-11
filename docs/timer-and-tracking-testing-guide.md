# Timer Persistence & Per-Question Time Tracking Testing Guide

## Overview
This guide provides comprehensive testing procedures for both timer persistence and per-question time tracking functionality.

## Prerequisites
1. Quiz application running locally or on test environment
2. Browser developer tools access
3. Test user account with quiz access
4. Database access to verify time tracking data

## Test Scenarios

### 1. Timer Persistence Tests

#### A. Basic Timer Persistence
**Objective**: Verify timer continues accurately after page refresh

**Steps**:
1. Login as test user
2. Start a quiz (note the timer value, e.g., 59:45)
3. Wait 30 seconds (timer should show ~59:15)
4. Refresh the browser page (F5 or Ctrl+R)
5. Verify timer shows approximately 59:15 (±2 seconds)

**Expected Result**: Timer resumes from correct remaining time
**Console Logs to Check**:
```
Restored quiz start time from localStorage: [timestamp]
calculateRemainingTime called with: { startTime: [date], quizDurationMinutes: 60, hasStartTime: true }
Timer calculation details: { elapsedSeconds: 30, remainingSeconds: 3570, remainingMinutes: 59 }
Starting timer with: { timeRemaining: 3570, quizStartTime: [date], quizSettings: {...} }
```

#### B. Timer Sync and Drift Correction
**Objective**: Verify periodic sync corrects timer drift

**Steps**:
1. Start quiz and wait for timer to stabilize
2. Change system clock forward by 5 minutes
3. Wait for sync cycle (30 seconds)
4. Verify timer adjusts to correct remaining time

**Expected Result**: Timer syncs to actual elapsed time
**Console Logs to Check**:
```
Timer sync: correcting drift { current: 3570, actual: 3270, diff: 300 }
```

### 2. Per-Question Time Tracking Tests

#### A. Basic Question Time Tracking
**Objective**: Verify time tracking starts/stops when navigating questions

**Steps**:
1. Start quiz and navigate to first question
2. Wait 10 seconds
3. Navigate to second question
4. Wait 15 seconds
5. Navigate back to first question

**Expected Result**: Time is tracked for each question
**Console Logs to Check**:
```
Starting time tracking for question: 10001
Stopped time tracking, elapsed: 10
Starting time tracking for question: 10002
Stopped time tracking, elapsed: 15
Starting time tracking for question: 10001
```

#### B. Page Refresh During Question Viewing
**Objective**: Verify time tracking resumes after page refresh

**Steps**:
1. Start quiz and view question for 20 seconds
2. Refresh page
3. Continue viewing same question for 10 more seconds
4. Navigate to next question

**Expected Result**: Total time for question includes pre-refresh time
**Console Logs to Check**:
```
Resuming question tracking after page refresh: { questionId: 10001, elapsedSinceStart: 20 }
Starting timer for question: 10001
Stopped time tracking, elapsed: 10
```

#### C. Database Verification
**Objective**: Verify time data is stored correctly in database

**Steps**:
1. Complete above tests
2. Check database for time tracking data

**SQL Query**:
```sql
SELECT 
  us.user_id,
  us.question_id,
  us.total_time_spent,
  q.question
FROM user_submissions us
JOIN questions q ON us.question_id = q.id
WHERE us.user_id = [test_user_id]
  AND us.total_time_spent > 0
ORDER BY us.question_id;
```

**Expected Result**: Records show accumulated time for each question

### 3. Integration Tests

#### A. Complete Quiz Flow with Time Tracking
**Objective**: Test full quiz flow with both timer and question tracking

**Steps**:
1. Start quiz (timer: 60:00)
2. Answer question 1 (spend 30 seconds)
3. Answer question 2 (spend 45 seconds)
4. Refresh page (timer should continue from ~58:45)
5. Answer question 3 (spend 20 seconds)
6. Submit quiz

**Expected Results**:
- Timer persists correctly throughout
- Each question has accurate time tracking
- Final submission includes all time data
- Database contains correct time records

#### B. Time Limit Expiry Test
**Objective**: Verify behavior when quiz time expires

**Steps**:
1. Set quiz time limit to 2 minutes
2. Start quiz and track question times
3. Let timer expire naturally
4. Verify auto-submission includes time data

**Expected Result**: All time tracking data is saved on auto-submission

### 4. Edge Case Tests

#### A. Multiple Tab Handling
**Objective**: Verify time tracking with multiple tabs

**Steps**:
1. Start quiz in Tab 1
2. Open same quiz URL in Tab 2
3. Navigate questions in both tabs
4. Verify time tracking consistency

**Expected Result**: Time tracking works correctly across tabs

#### B. Network Connectivity Issues
**Objective**: Test behavior during network issues

**Steps**:
1. Start quiz and track question times
2. Disconnect network
3. Continue navigating questions
4. Reconnect network
5. Submit quiz

**Expected Result**: Time data is preserved and synced when network returns

#### C. Browser Tab Switching
**Objective**: Verify time tracking during tab switches

**Steps**:
1. Start quiz and begin viewing question
2. Switch to another browser tab for 30 seconds
3. Return to quiz tab
4. Navigate to next question

**Expected Result**: Time includes tab-away duration (this is expected behavior)

### 5. Performance Tests

#### A. Memory Usage Test
**Objective**: Verify no memory leaks from time tracking

**Steps**:
1. Start quiz and monitor memory usage
2. Navigate through all questions multiple times
3. Refresh page several times
4. Check for memory leaks

**Expected Result**: Memory usage remains stable

#### B. Database Performance Test
**Objective**: Verify time updates don't impact performance

**Steps**:
1. Complete quiz with frequent question navigation
2. Monitor database query performance
3. Check for any slow queries

**Expected Result**: No significant performance impact

## Debugging Tools

### Browser Console Commands

#### Check Current Timer State
```javascript
// Check localStorage data
console.log('Quiz start time:', localStorage.getItem('quiz_start_time'));
console.log('Question times:', localStorage.getItem('quiz_question_times'));
console.log('Current tracker:', localStorage.getItem('quiz_current_question_tracker'));
```

#### Simulate Time Scenarios
```javascript
// Simulate quiz started 10 minutes ago
const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
localStorage.setItem('quiz_start_time', JSON.stringify(tenMinutesAgo));
location.reload();

// Simulate question viewed for 5 minutes
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
const tracker = {
  questionId: 10001,
  totalTimeSpent: 0,
  lastStartTime: fiveMinutesAgo.toISOString()
};
localStorage.setItem('quiz_current_question_tracker', JSON.stringify(tracker));
location.reload();
```

### Database Queries

#### Check Timer Persistence Data
```sql
-- Check quiz start times
SELECT id, name, quiz_started_at, quiz_completed_at, quiz_attempted
FROM users 
WHERE id = [test_user_id];

-- Check question time tracking
SELECT 
  question_id,
  total_time_spent,
  option,
  CASE 
    WHEN total_time_spent > 0 THEN 'Has Time Data'
    ELSE 'No Time Data'
  END as time_status
FROM user_submissions 
WHERE user_id = [test_user_id]
ORDER BY question_id;
```

## Success Criteria

### Timer Persistence
✅ Timer continues accurately after page refresh  
✅ Timer sync corrects drift every 30 seconds  
✅ Time expiry works correctly  
✅ Server-side validation prevents manipulation  

### Per-Question Time Tracking
✅ Time tracking starts/stops on question navigation  
✅ Time data persists across page refreshes  
✅ Database stores accurate time records  
✅ Batch updates work on quiz submission  

### Performance
✅ No memory leaks or performance issues  
✅ Database queries remain efficient  
✅ Client-side storage usage is minimal  

### Security
✅ Time data cannot be easily manipulated  
✅ Server-side validation works correctly  
✅ Reasonable time limits are enforced  

## Common Issues and Solutions

### Issue: Timer resets to full duration
**Solution**: Check console for `calculateRemainingTime` logs and verify `quizStartTime` is loaded

### Issue: Question time tracking not working
**Solution**: Check console for time tracking logs and verify `useQuestionTimeTracker` hook is functioning

### Issue: Database not updating
**Solution**: Check network tab for API calls and verify server-side functions are working

### Issue: Page refresh loses data
**Solution**: Verify localStorage is being saved and restored correctly

This comprehensive testing ensures both timer persistence and per-question time tracking work reliably across all scenarios.
