import { redirect } from 'next/navigation';

export default function AdminPage() {
	// Redirect to /admin/manage-quiz
	redirect('/admin/manage-quiz');
}
