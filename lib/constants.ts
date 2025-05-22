export const subjects = [
	{ key: 'physics', value: 'Physics' },
	{ key: 'chemistry', value: 'Chemistry' },
	{ key: 'math', value: 'Math' },
	{ key: 'biology', value: 'Biology' },
	{ key: 'social', value: 'Social Science' },
	{ key: 'english', value: 'English Languages' },
	{ key: 'gk', value: 'General Knowledge' },
	{ key: 'computer', value: 'Computer Science' },
	{ key: 'commerce', value: 'Commerce' },
] as const;

export const subjectKeys = subjects.map((subject) => subject.key);
export type SubjectKey = typeof subjects[number]['key'];
