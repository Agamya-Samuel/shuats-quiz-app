# PRD for Student Counselling Portal with Online Quiz/Exam

## Objective
Helping student to find the courses they should take up, based upon their -
- interests (survey)
- their skill-sets (survey)
- their academic knowledge (quiz)
and recommending them appropriate courses,
- job roles/position opportunities for the respective courses
- private and govt job opportunities
- salaries range they can expect after doing the courses
- what course our college has to offer
- what course structure we can follow
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
