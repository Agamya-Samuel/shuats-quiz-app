# PRD for Student Counselling Portal with Online Quiz/Exam

## Objective
Helping student to find the courses they should take up, based upon their -
- interests (survey)
- their skill-sets (survey)
- their academic knowledge (quiz)
and recommending them appropriate courses,

## Parameters to Consider when declaring RESULT ANALYSIS
- job roles/position opportunities for the respective courses
- private and govt job opportunities in India
- Opportunities within India, and Foreign Opportunities
- salaries range they can expect after doing the courses
- what course our college (SHUATS) has to offer
- what course structure we follow in out curriculum
- what extra +1 skill they can learn with their academic course (like BSc + Excel + AI) to boost their skills and increase their value in the market

## Database Requirements

#### User Management
- Users
- Admins

#### Survey Management
- Survey Questions with more than 4 options
- Submitted Answers by students [enc]

#### Quiz Management
- Quiz Questions with options [enc]
- Correct Answers [enc] [will be added after exam taken place]
- Submitted Answers by students [enc]

#### Students Analysis
- courses recommended
- job and salary opportunities
- extra skills to learn
- courses our college offers

## Other Requirements
- need to implement user-permission model

## [Phase - 1] Before Quiz Day
- [x] homepage w/ department's pic
- [ ] registration page/short survey to gather
	- [ ] basic user info [name, email, mobile, school name, address, roll number]
	- [ ] mcq questions to gather interests and skill of the user in order to make a proper profile of the user for later analysis
- [ ] email notification for user registration confirmation
- [ ] admin dashboard page to view registered users
- [ ] login page, [on non-quiz day], that shows data/time schedule for exam


## [Phase - 2] On Quiz Day
- [ ] interface for quiz
	- [ ] login page [on d-day]:
		- [ ] [page 1] display user info
		- [ ] [page 2] instructions before exam
			- [ ] instructions:
				- [ ] how to attempt paper				
				- [ ] total questions
				- [ ] various subjects
				- [ ] no of questions per subject
				- [ ] total time
		- [ ] [page 3] pursue students to choose their strongest subject
- [ ] dashboard page to see current quiz status
	- [ ] show list of questions, option to add, edit question
	- [ ] [on d-day] no of users online/attempting questions/ all other states if possible
	- [ ] interface to add questions for Quiz + Survey.

## [Phase - 3] After Quiz Day - Result not Declared
- [ ] user dashboard page - to see quiz status (if attempted/not attempted) Result Declared on not?

## [Phase - 4] After Quiz Day - Result Declared
- [ ] show detailed analysis of Quiz
	- [ ] show correct answers
	- [ ] show wrong answers
	- [ ] show percentage of correct answers
	- [ ] show percentage of wrong answers
	- [ ] show percentage of skipped answers
	- [ ] show percentage of total answers
- [ ] analyze user's profile based on [survey + quiz] answers
- [ ] recommend course based on
- [ ] notify user about result declaration
- [ ] add sentry for error monitoring

# TODO

- [x] when on last question, show `Save & Next` button, when clicked, it should show a Dialog box to confirm if user wants to submit the quiz.
- [x] when time is over, end the quiz and auto submit the quiz answers.
- [X] `/result` and `/leaderboard` mode them to `/user/result` and `/user/leaderboard`
- [x] make consistent use of loading spinner.
- [x] add shuats logo to the quiz page.
- [x] add shuats catalog pics carousel + image viewer to the quiz `leaderboard` page + `result` page.
- [x] add markdown preview in `result` page.
- [x] make result page grid view.
- [ ] remove `Mark for Review` button from the quiz page.
- [X] add choice of subject before quiz starts.
- [x] randomize the question order in quiz.
- [ ] when quiz starts, record the start time in database and based in the start time, make the timer run accordingly, and end time in database, and calculate the time taken by the user to complete the quiz.

# TODO (Stage 2)

- [ ] Migrate to DB from, MongoDB to PostgreSQL
- [ ] Add Sentry for error monitoring

---

- ## User Registration Flow - Update
	- [ ] User Basic Details - Signup Page (Page 1)
		- [ ] Name, Email, Mobile, Password
	- [ ] User Academic Details - Dashboard (Page 2)
			- [ ] School Name, Address, Roll Number, Class, Stream, Subjects
	- [ ] User Document Verification Upload (Page 3)	
		- [ ] Upload Documents (10th Marksheet, 12th Marksheet, Aadhar Card)
	- [ ] After Registration, show the details to the user for confirmation
	- [ ] Send Email Confirmation to the user with the details
	- If user closes the page at any point, and logs back in, show "Fill Registration Form" button.
	- [ ] If user has already filled the form, show "The Quiz Date is on DD/MM/YYYY Time - HH:MM".

---

- [ ] Protect all Server Actions with Data Access Layer (DAL) and Middleware
	- [ ] For every Request from users, add a log to the database with the following details (Middleware or Data Access Layer):
		- [ ] User ID
		- [ ] Request Type (Login, Registration, Quiz, Survey, etc.)
		- [ ] Request Time
		- [ ] Request Status (Success, Failed, Pending)
		- [ ] Request IP Address
		- [ ] Request User Agent 
- [ ] For every Request from users, add a log to the database with the following details (Middleware or Data Access Layer):
	- [ ] User ID
	- [ ] Request Type (Login, Registration, Quiz, Survey, etc.)
	- [ ] Request Time
	- [ ] Request Status (Success, Failed, Pending)
	- [ ] Request IP Address
	- [ ] Request User Agent

---

- ## User Quiz
	- [ ] Quiz Starting Page
		- [ ] Show Quiz Instructions
			- [ ] Subjects: [Subject 1, Subject 2, Subject 3]
			- [ ] Total Questions: xx Questions
			- [ ] Total Time: xx Minutes
			- [ ] Total Marks: xx Marks
			- Marking Scheme
				- [ ] Correct Answer: +1 Mark
				- [ ] Wrong Answer: -0.25 Mark
				- [ ] Unattempted Question: 0 Mark
			- [ ] Show "Start Quiz" Button
	- [ ] Quiz Page -> No Update
	- Timer Should be Server Side, and should be in sync with the server time. (Use Socket.io or WebSockets, Only Allow delay {upto 1 min delay} at the end, when submitting the quiz)

---

- ## Admin Dashboard
	- [ ] Separate Admin Dashboard, from User Quiz for Security Concerns
	- Features
		- Dashboard Overview Page
			- [ ] Total Users Registered (Use Graphs and Charts)
			- [ ] Total Questions Created
			- [ ] Set Quiz Date and Time
			- [ ] Set Quiz Duration
			- [ ] Start Quiz Button
		- User Management
			- [ ] View All Users
			- [ ] View User Details
				- [ ] View User Documents for Verification
			- [ ] Edit User Details
			- [ ] Delete User
		- Question Management
			- [ ] View All Questions
			- [ ] Add Questions
			- [ ] Edit Questions
			- [ ] Delete Question

---

- [ ] For Analytics, use Google Analytics, Mixpanel or Amplitude
- [ ] For tracking events use Segment or Mixpanel

---

- [ ] For user session recording use Hotjar or FullStory
- [ ] For A/B testing use Optimizely or Google Optimize

---

- [ ] For user heatmap use Hotjar or Crazy Egg

---

- [ ] For user SMS use Twilio or Plivo
- In App Notification
	- [ ] For user feedback in-app notification use Socket.io or WebSockets
	- [ ] For user feedback push notification use OneSignal or Pushwoosh
	- [ ] For user feedback in-app notification use Intercom or Drift

---


<!-- For Agamya -->

#### Important
- [x] Add S3 bucket support to upload documents and profile photo.
- [x] Add DAL (Data Access Layer) to all actions, specially to quiz submit action and all admin actions.
	- [ ] Give Final Review to DAL once again.
- [x] After Registering, login user, redirect to dashboard and ask for document upload.
- [x] Profile photo upload during registration.
- [x] in navbar, show profile photo
- [ ] add dummy user to db, to test the quiz.
- [ ] add dummy question to db, to test the quiz.
- [ ] record user quiz submit time_stamp in db.
- [ ] add logo to every login component.
- [ ] fix error in fetching questions, when quiz is going on.
- [ ] fix: update user profile is not working.
- [ ] remove logout, navbar when quiz is being attempted by the user.
- [ ] fix Broken backlink `/dashboard`
- [ ] fix mobile view when user is attempting the quiz.
- [ ] reduce image quality of shuats catalog pics, to improve page load time. (remove image that maybe invisible image_url)
- [ ] in Admin Dashboard, add option for Manual Result Generation for all users.
- [ ] Add guidlines for Exam Rules, Question Format, Syllabus, Scoring Criteria (preferece order of subjects, time taken to complete the quiz, etc.)
	- [ ] Subjects: 'Arithmatic - 10 Qs', 'Reasoning - 20 Qs', 'Computer Aptitude - 30 Qs', 'General Knowledge - 30 Qs'
- [ ] Add logging (saves to db) to all actions, and log the user id, request type, request time, request status, request ip address, request user agent.
	- [ ] specially for admin actions, log the admin id, request type, request time, request status, request ip address, request user agent.
- [ ] Add validation -> if user calls `get_all_question` action, first check if the quiz is active or not, if not, return appropriate message.
- [ ] Add validation -> if user calls `get_result` action, first check if the quiz result is declared or not, if not, return appropriate message.
- [ ] Add validation -> if user calls `get_leaderboard` action, first check if the quiz result is declared or not, if not, return appropriate message.
- [ ] Add db_seeding for quiz configuration settings, add admin user to the db.

#### Medium Priority
- [x] Make the First Prize Bigger pop out more than other prizes.
- [ ] when document upload is verified by an admin, store it in the db approved_by_admin column.
- [ ] in navbar, why fecthing quiz results ? investigate it if not needed.
- [ ] in `next.config.ts`, setting body size limit to 5mb, investigate this, how safe is this?
- [ ] Fix overall Type Checking issues, improve type safety, implement proper types and interfaces.
- [ ] Fix `contexts\cookie-context.tsx` types/interface for `user` cookie.
- [ ] Add DB Index to
	- [ ] questions.text
	- [ ] questions.subject
	- [ ] upload
- [ ] Add logging (saves to db) to all actions
- [ ] Kubernetes for Auto Scaling ? minimum 2 instance, maximum 5 instances
	- [ ] Load Balancer
- [ ] Add Analytics to the app using Google Analytics, Mixpanel or Amplitude
- [ ] in shuatsquiz add: a dashboard to start-end quiz, and emergency section in case of load too much and other such cases.
