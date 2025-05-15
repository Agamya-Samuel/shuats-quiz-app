CREATE TABLE "quiz_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"per_quiz_time_limit" integer DEFAULT 30,
	"per_question_time_limit" integer DEFAULT 0,
	"enable_per_question_timer" boolean DEFAULT false,
	"show_countdown" boolean DEFAULT true,
	"is_live" boolean DEFAULT true,
	"is_scheduled" boolean DEFAULT false,
	"scheduled_date" timestamp,
	"randomize_questions" boolean DEFAULT true,
	"show_results_mode" text DEFAULT 'manual',
	"allow_retake" boolean DEFAULT false,
	"max_attempts" integer DEFAULT 1,
	"show_correct_answers" boolean DEFAULT false,
	"prevent_tab_switching" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
