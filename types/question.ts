export interface IOption {
	id: string;
	value: string;
}

export interface IQuestion {
	id: number;
	question: string;
	options: IOption[];
	subject: string;
}

export interface IQuestionWithAnswers extends IQuestion {
	correctOption: string;
}

export interface ICorrectAnswer {
	questionId: number;
	correctOption: string;
}

