import { redirect } from 'next/navigation';

export default function AdminPage() {
	// Redirect to /user/quiz
	redirect('/user/quiz');
}
