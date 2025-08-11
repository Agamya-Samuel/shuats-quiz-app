// app/user/quiz/page.tsx
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import Footer from '@/app/user/quiz/_components/Footer';
import QuizInterface from '@/app/user/quiz/_components/quiz-interface';
import { db } from '@/db';
import { uploadFiles, users } from '@/db/schema';
import { UserSessionPayload, getUserSession } from '@/lib/auth';


export default async function QuizPage() {
  const session: UserSessionPayload | null = await getUserSession();

  if (!session || !session.userId) {
    console.log('QuizPage: No session or userId, redirecting to /login');
    redirect('/login');
  }

  let userProfile;
  try {
    userProfile = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
        profileStage1Completed: true,
        quizAttempted: true,
        // profileStage2Completed is no longer directly used here for quiz access
      },
    });
  } catch (dbError) {
    console.error('QuizPage: Database error fetching user profile:', dbError);
    redirect('/login?error=db_error');
  }

  if (!userProfile) {
    console.log(
      `QuizPage: User profile not found for userId: ${session.userId}, redirecting to /login`,
    );
    redirect('/login?error=user_not_found');
  }

  if (!userProfile.profileStage1Completed) {
    console.log(
      `QuizPage: Profile stage 1 not complete for userId: ${session.userId}, redirecting to /user/complete-profile`,
    );
    redirect('/user/complete-profile');
  }

  if (userProfile.quizAttempted) {
    console.log(
      `QuizPage: Quiz already attempted by userId: ${session.userId}, redirecting to /user/quiz/completion`,
    );
    redirect('/user/quiz/completion');
  }


  // All checks passed, user can access the quiz.
  // The QuizInterface component can remain a client component if needed for interactivity.
  // Any client-side logic previously in QuizPage (like router, useState, useEffect for UI)
  // should now be within QuizInterface or another client component.
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-111px)]">
      <QuizInterface />
      <Footer />
    </div>
  );
}
