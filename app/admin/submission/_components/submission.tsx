import { getUsers } from '@/actions/admin';
import SubmissionClientPage from './submission-client-page';

export default async function Submission() {
  const { users, success } = await getUsers();

  if (!success) {
    return <div>Failed to fetch users</div>;
  }

  return <SubmissionClientPage users={users || []} />;
}