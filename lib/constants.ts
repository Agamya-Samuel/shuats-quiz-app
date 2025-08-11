export const subjects = [
	{ key: 'gk', value: 'General Knowledge' },
	{ key: 'computer', value: 'Computer' },
	{ key: 'logical_reasoning', value: 'Logical Reasoning' },
] as const;

export const subjectKeys = subjects.map((subject) => subject.key);
export type SubjectKey = typeof subjects[number]['key'];
