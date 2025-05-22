import Link from 'next/link';

export const metadata = {
	title: 'Terms of Service - SHUATS Online Quiz',
	description: 'Terms of Service for SHUATS Online Quiz app',
};

export default function TermsPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Terms of Service
				</h1>
				<p className="text-sm text-muted-foreground mb-6 text-center">
					Effective Date: May 12, 2025
				</p>

				<div className="prose prose-slate max-w-none">
					<h2 className="text-xl font-semibold mt-8 mb-4">
						1. Acceptance of Terms
					</h2>
					<p>
						By downloading, installing, or using the{' '}
						<strong>SHUATS Online Quiz</strong> app, you agree to be
						bound by these Terms of Service. If you do not agree
						with any part of these terms, please refrain from using
						the app.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						2. Eligibility
					</h2>
					<p>
						The app is intended for use by students, faculty, and
						authorized personnel of SHUATS. By using the app, you
						confirm that you are affiliated with SHUATS and have the
						necessary permissions to access its features.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						3. User Responsibilities
					</h2>
					<p>
						As a user of the SHUATS Online Quiz app, you agree to:
					</p>
					<ul className="list-disc pl-6 my-4 space-y-2">
						<li>
							<strong>Provide Accurate Information:</strong>{' '}
							Ensure that all information you provide is truthful
							and up-to-date.
						</li>
						<li>
							<strong>Maintain Confidentiality:</strong> Keep your
							login credentials secure and do not share them with
							others.
						</li>
						<li>
							<strong>Use the App Appropriately:</strong> Engage
							with the app&apos;s features in a manner consistent
							with SHUATS&apos;s academic and ethical standards.
						</li>
						<li>
							<strong>Report Issues:</strong> Notify the
							Department of Computer Science & IT promptly if you
							encounter any problems or suspect unauthorized
							access.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						4. Prohibited Conduct
					</h2>
					<p>Users must not:</p>
					<ul className="list-disc pl-6 my-4 space-y-2">
						<li>
							<strong>Misuse the App:</strong> Engage in
							activities that disrupt or interfere with the
							app&apos;s functionality.
						</li>
						<li>
							<strong>Access Unauthorized Content:</strong>{' '}
							Attempt to access data or features for which you do
							not have permission.
						</li>
						<li>
							<strong>Distribute Malicious Software:</strong>{' '}
							Upload or transmit viruses, malware, or other
							harmful code.
						</li>
						<li>
							<strong>Violate Laws or Regulations:</strong> Use
							the app in a manner that contravenes local,
							national, or international laws.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						5. Intellectual Property
					</h2>
					<p>
						All content, features, and functionality of the SHUATS
						Online Quiz app are the exclusive property of SHUATS.
						Unauthorized reproduction, distribution, or modification
						is strictly prohibited.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						6. Data Privacy
					</h2>
					<p>
						Your use of the app is also governed by our{' '}
						<Link
							href="/privacy"
							className="text-blue-600 hover:underline"
						>
							Privacy Policy
						</Link>
						, which outlines how we collect, use, and protect your
						personal information.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						7. Limitation of Liability
					</h2>
					<p>
						SHUATS and the Department of Computer Science & IT are
						not liable for any direct, indirect, incidental, or
						consequential damages arising from your use of the app.
						The app is provided &quot;as is&quot; without warranties
						of any kind.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						8. Modifications to Terms
					</h2>
					<p>
						We reserve the right to update or modify these Terms of
						Service at any time. Changes will be effective upon
						posting on this page. Continued use of the app after
						such changes constitutes acceptance of the new terms.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						9. Termination
					</h2>
					<p>
						We may suspend or terminate your access to the app at
						our discretion, without prior notice, if you violate
						these terms or engage in conduct detrimental to the
						app&apos;s integrity or SHUATS&apos;s reputation.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						10. Contact Information
					</h2>
					<p>
						For questions or concerns regarding these Terms of
						Service, please contact:
					</p>
					<div className="mt-4 p-4 bg-gray-50 rounded-md">
						<p>
							<strong>Department of Computer Science & IT</strong>
							<br />
							Sam Higginbottom University of Agriculture,
							Technology and Sciences (SHUATS)
							<br />
							Rewa Road, Naini, Prayagraj – 211007, Uttar Pradesh,
							India
							<br />
							Email:{' '}
							<a
								href="mailto:smc@shuats.edu.in"
								className="text-blue-600 hover:underline"
							>
								smc@shuats.edu.in
							</a>
							<br />
							Website:{' '}
							<a
								href="https://www.shuats.edu.in"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								www.shuats.edu.in
							</a>
						</p>
					</div>

					<div className="mt-8 p-4 bg-indigo-50 rounded-md">
						<p className="font-medium">
							By using the SHUATS Online Quiz app, you acknowledge
							that you have read, understood, and agree to be
							bound by these Terms of Service.
						</p>
					</div>
				</div>

				<div className="mt-8 pt-4 border-t border-gray-200 text-center">
					<Link
						href="/"
						className="text-indigo-600 hover:text-indigo-800 font-medium"
					>
						Return to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
