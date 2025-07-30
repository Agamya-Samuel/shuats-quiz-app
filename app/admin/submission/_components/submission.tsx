import { getUsersWithSubmissionCount } from '@/actions/admin';
import SubmissionClientPage from './submission-client-page';

export default async function Submission() {
  const { users, success, totalQuestions } = await getUsersWithSubmissionCount();

  if (!success) {
    return <div>Failed to fetch users</div>;
  }

  return (
    <SubmissionClientPage
      users={users || []}
      totalQuestions={totalQuestions || 0}
    />
  );
}