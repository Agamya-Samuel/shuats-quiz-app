"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Play, Square, Clock, CalendarPlus2Icon as CalendarIcon2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface Quiz {
  id: string
  title: string
  status: "active" | "inactive" | "scheduled"
  startTime: Date | null
  endTime: Date | null
  timeLimit: number
}

export function QuizControl() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Mathematics Quiz - Algebra",
      status: "active",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour from now
      timeLimit: 30,
    },
    {
      id: "2",
      title: "Science Quiz - Physics",
      status: "inactive",
      startTime: null,
      endTime: null,
      timeLimit: 45,
    },
    {
      id: "3",
      title: "History Quiz - World War II",
      status: "scheduled",
      startTime: new Date(Date.now() + 86400000), // 1 day from now
      endTime: new Date(Date.now() + 90000000), // 1 day + 1 hour from now
      timeLimit: 60,
    },
  ])

  const toggleQuizStatus = (id: string) => {
    setQuizzes(
      quizzes.map((quiz) => {
        if (quiz.id === id) {
          const newStatus = quiz.status === "active" ? "inactive" : "active"
          toast({
            title: `Quiz ${newStatus === "active" ? "Activated" : "Deactivated"}`,
            description: `"${quiz.title}" has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
            variant: newStatus === "active" ? "success" : "default",
          })
          return { ...quiz, status: newStatus }
        }
        return quiz
      }),
    )
  }

  const startQuiz = (id: string) => {
    setQuizzes(
      quizzes.map((quiz) => {
        if (quiz.id === id) {
          toast({
            title: "Quiz Started",
            description: `"${quiz.title}" has been started manually.`,
            variant: "success",
          })
          return {
            ...quiz,
            status: "active",
            startTime: new Date(),
            endTime: new Date(Date.now() + quiz.timeLimit * 60 * 1000),
          }
        }
        return quiz
      }),
    )
  }

  const stopQuiz = (id: string) => {
    setQuizzes(
      quizzes.map((quiz) => {
        if (quiz.id === id) {
          toast({
            title: "Quiz Stopped",
            description: `"${quiz.title}" has been stopped manually.`,
            variant: "default",
          })
          return { ...quiz, status: "inactive", endTime: new Date() }
        }
        return quiz
      }),
    )
  }

  const scheduleQuiz = (id: string, startTime: Date, endTime: Date) => {
    setQuizzes(
      quizzes.map((quiz) => {
        if (quiz.id === id) {
          toast({
            title: "Quiz Scheduled",
            description: `"${quiz.title}" has been scheduled.`,
            variant: "success",
          })
          return { ...quiz, status: "scheduled", startTime, endTime }
        }
        return quiz
      }),
    )
  }

  const updateTimeLimit = (id: string, timeLimit: number) => {
    setQuizzes(
      quizzes.map((quiz) => {
        if (quiz.id === id) {
          toast({
            title: "Time Limit Updated",
            description: `Time limit for "${quiz.title}" has been updated to ${timeLimit} minutes.`,
            variant: "success",
          })
          return { ...quiz, timeLimit }
        }
        return quiz
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Control Panel</CardTitle>
          <CardDescription>
            Enable/disable quizzes, start/stop manually, or schedule for automatic execution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{quiz.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          quiz.status === "active" ? "success" : quiz.status === "scheduled" ? "warning" : "outline"
                        }
                      >
                        {quiz.status === "active" ? "Active" : quiz.status === "scheduled" ? "Scheduled" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Time Limit: {quiz.timeLimit} min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`quiz-status-${quiz.id}`}
                        checked={quiz.status === "active"}
                        onCheckedChange={() => toggleQuizStatus(quiz.id)}
                      />
                      <Label htmlFor={`quiz-status-${quiz.id}`}>
                        {quiz.status === "active" ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startQuiz(quiz.id)}
                      disabled={quiz.status === "active"}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => stopQuiz(quiz.id)}
                      disabled={quiz.status !== "active"}
                      className="flex items-center gap-1"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`time-limit-${quiz.id}`}>Time Limit (minutes)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`time-limit-${quiz.id}`}
                        type="number"
                        min="1"
                        value={quiz.timeLimit}
                        onChange={(e) => updateTimeLimit(quiz.id, Number.parseInt(e.target.value) || 30)}
                        className="w-24"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateTimeLimit(quiz.id, quiz.timeLimit)
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Set
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Quiz</Label>
                    <div className="flex flex-wrap gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {quiz.startTime ? format(quiz.startTime, "PPP") : "Set Start Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={quiz.startTime || undefined}
                            onSelect={(date) => {
                              if (date) {
                                const endTime = quiz.endTime || new Date(date.getTime() + quiz.timeLimit * 60 * 1000)
                                scheduleQuiz(quiz.id, date, endTime)
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <CalendarIcon2 className="h-4 w-4" />
                            {quiz.endTime ? format(quiz.endTime, "PPP") : "Set End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={quiz.endTime || undefined}
                            onSelect={(date) => {
                              if (date && quiz.startTime) {
                                scheduleQuiz(quiz.id, quiz.startTime, date)
                              } else if (date) {
                                const startTime = new Date()
                                scheduleQuiz(quiz.id, startTime, date)
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
