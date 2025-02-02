// app/user/quiz/_components/legend.tsx
import { Badge } from "@/components/ui/badge";
import { Question } from "./quiz-interface";

interface LegendProps {
    questions: Question[];
}

export default function Legend({ questions }: LegendProps) {
    return (
        <div className="mt-6 space-y-2">
            <h4 className="font-semibold mb-3">Legend</h4>
            <div className="flex items-center gap-2">
                <Badge variant="outline">
                    {questions.filter(q => q.status === 'not-visited').length}
                </Badge>
                <span className="text-sm">Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-100">
                    {questions.filter(q => q.status === 'not-answered').length}
                </Badge>
                <span className="text-sm">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100">
                    {questions.filter(q => q.status === 'answered').length}
                </Badge>
                <span className="text-sm">Answered</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-100">
                    {questions.filter(q => q.status === 'marked-review').length}
                </Badge>
                <span className="text-sm">Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100">
                    {questions.filter(q => q.status === 'answered-marked').length}
                </Badge>
                <span className="text-sm">Answered & Marked for Review</span>
            </div>
        </div>
    );
}