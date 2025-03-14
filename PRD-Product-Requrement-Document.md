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