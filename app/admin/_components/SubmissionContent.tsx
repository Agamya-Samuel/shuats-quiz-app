import { getUsersWithSubmissionCount } from '@/actions/admin';
import SubmissionClientPage from './SubmissionClientPage';

export default async function SubmissionContent() {
  const { users, totalQuestions, success } =
    await getUsersWithSubmissionCount();

  if (!success) {
    return <div>Failed to fetch users</div>;
  }

  return (
    <div>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Reset User Submissions
        </h2>
        <p className="text-muted-foreground">
          Reset quiz submissions for a specific user
        </p>
      </div>
      <SubmissionClientPage
        users={users || []}
        totalQuestions={totalQuestions || 0}
      />
    </div>
  );
}