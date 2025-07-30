// app/user/quiz/page.tsx
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import QuizInterface from '@/app/user/quiz/_components/quiz-interface';
import { db } from '@/db';
import { uploadFiles, users } from '@/db/schema';
import { UserSessionPayload, getUserSession } from '@/lib/auth';

const REQUIRED_DOCUMENT_TYPES = [
  'profile_pic',
  'aadhar',
  '10th_marksheet',
  '12th_marksheet',
];

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

  // If profile stage 1 is complete, check for required documents
  let uploadedUserDocuments;
  try {
    uploadedUserDocuments = await db.query.uploadFiles.findMany({
      where: eq(uploadFiles.userId, session.userId),
      columns: {
        documentType: true,
        verified: true, // We should check if they are verified as per your previous change
      },
    });
  } catch (dbError) {
    console.error('QuizPage: Database error fetching user documents:', dbError);
    redirect('/login?error=db_docs_error');
  }

  // Define an interface for the shape of documents we expect from the query
  interface QueriedUploadFile {
    documentType: string;
    verified: boolean | null;
  }

  const verifiedUploadedTypes = (
    uploadedUserDocuments || ([] as QueriedUploadFile[])
  )
    .filter((doc: QueriedUploadFile) => doc.verified === true) // Explicitly check for true
    .map((doc: QueriedUploadFile) => doc.documentType);
  const hasAllRequiredDocuments = REQUIRED_DOCUMENT_TYPES.every(
    (requiredType) => verifiedUploadedTypes.includes(requiredType),
  );

  if (!hasAllRequiredDocuments) {
    console.log(
      `QuizPage: Not all required documents uploaded/verified for userId: ${session.userId}. Missing: ${REQUIRED_DOCUMENT_TYPES.filter((rt) => !verifiedUploadedTypes.includes(rt)).join(', ')}. Redirecting to /user/document-upload`,
    );
    redirect('/user/document-upload');
  }

  // All checks passed, user can access the quiz.
  // The QuizInterface component can remain a client component if needed for interactivity.
  // Any client-side logic previously in QuizPage (like router, useState, useEffect for UI)
  // should now be within QuizInterface or another client component.
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-111px)]">
      <QuizInterface />
    </div>
  );
}
