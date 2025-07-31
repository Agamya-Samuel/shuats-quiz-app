'use client';

import { AlertCircle, ChevronRight, Info } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PreQuizPromptProps {
  onStartQuiz: () => void;
  isLive: boolean;
}

export default function PreQuizPrompt({
  onStartQuiz,
  isLive,
}: PreQuizPromptProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Info className="h-5 w-5" />
            <span>Before Starting the Quiz</span>
          </CardTitle>
          <CardDescription className="text-center">
            Please read the following points carefully.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLive && (
            <div className="mb-6 flex items-center justify-center rounded-full bg-green-100 p-3 text-center text-green-800">
              <span className="relative mr-3 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              <p className="text-lg font-semibold">The Quiz is Live!</p>
            </div>
          )}

          <ul className="space-y-4 text-sm text-muted-foreground mb-6">
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-primary" />
              <span>Once the Quiz begins, you cannot quit in between.</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-primary" />
              <span>
                This quiz is under surveillance for Malpractice and Unfair
                means, and there are checks to prevent it. Any malpractice from
                your side will lead to immediate Termination of your
                Participation.
              </span>
            </li>
          </ul>

          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm text-amber-700">
              Are you sure you want to begin the quiz?
            </AlertDescription>
          </Alert>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={onStartQuiz}
              className="w-full sm:w-auto"
              variant="success">
              Start Quiz
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
