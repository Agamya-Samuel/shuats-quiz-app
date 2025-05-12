import Link from 'next/link';

export const metadata = {
	title: 'Privacy Policy - SHUATS Online Quiz',
	description: 'Privacy Policy for SHUATS Online Quiz app',
};

export default function PrivacyPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Privacy Policy
				</h1>
				<p className="text-sm text-muted-foreground mb-6 text-center">
					Effective Date: May 12, 2025
				</p>

				<div className="prose prose-slate max-w-none">
					<p>
						The <strong>SHUATS Online Quiz</strong> app is developed
						and maintained by the Department of Computer Science &
						IT, Sam Higginbottom University of Agriculture,
						Technology and Sciences (SHUATS), Prayagraj, India. This
						Privacy Policy explains how we collect, use, and
						safeguard your information when you use our mobile
						application.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						1. Information Collection and Use
					</h2>
					<p>
						For an enhanced user experience, we may collect certain
						personally identifiable information, including but not
						limited to:
					</p>
					<ul className="list-disc pl-6 my-4 space-y-2">
						<li>
							<strong>Personal Information</strong>: Name, email
							address, and student ID, primarily for
							authentication and user profile management.
						</li>
						<li>
							<strong>Device Information</strong>: Device ID,
							operating system, and browser type to optimize app
							performance.
						</li>
						<li>
							<strong>Usage Data</strong>: Information on how the
							app is accessed and used, including quiz attempts,
							scores, and session durations.
						</li>
					</ul>
					<p>
						This information is used solely for providing and
						improving the app&apos;s services. We do not share your
						personal information with third parties except as
						described in this policy.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						2. Log Data
					</h2>
					<p>
						In case of errors or issues within the app, we collect
						data and information (through third-party products) on
						your device called Log Data. This may include details
						such as your device&apos;s IP address, device name,
						operating system version, app configuration, time and
						date of usage, and other statistics.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						3. Cookies
					</h2>
					<p>
						The app does not explicitly use cookies. However, it may
						incorporate third-party code and libraries that use
						cookies to collect information and enhance their
						services. You have the option to accept or refuse these
						cookies and to know when a cookie is being sent to your
						device. Refusing cookies may limit certain
						functionalities of the app.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						4. Third-Party Services
					</h2>
					<p>
						We may employ third-party companies and individuals for
						the following purposes:
					</p>
					<ul className="list-disc pl-6 my-4 space-y-2">
						<li>To facilitate our Service;</li>
						<li>To provide the Service on our behalf;</li>
						<li>To perform Service-related services; or</li>
						<li>
							To assist us in analyzing how our Service is used.
						</li>
					</ul>
					<p>
						These third parties have access to your Personal
						Information only to perform these tasks on our behalf
						and are obligated not to disclose or use it for any
						other purpose.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						5. Data Security
					</h2>
					<p>
						We value your trust in providing us your Personal
						Information and strive to use commercially acceptable
						means of protecting it. However, no method of
						transmission over the internet or method of electronic
						storage is 100% secure, and we cannot guarantee its
						absolute security.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						6. Links to Other Sites
					</h2>
					<p>
						Our app may contain links to external sites not operated
						by us. If you click on a third-party link, you will be
						directed to that site. We strongly advise you to review
						the Privacy Policy of these websites. We have no control
						over and assume no responsibility for the content,
						privacy policies, or practices of any third-party sites
						or services.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						7. Children&apos;s Privacy
					</h2>
					<p>
						Our Services are not intended for individuals under the
						age of 13. We do not knowingly collect personally
						identifiable information from children under 13. In the
						case we discover that a child under 13 has provided us
						with personal information, we immediately delete this
						from our servers. If you are a parent or guardian and
						you are aware that your child has provided us with
						personal information, please contact us so that we can
						take necessary actions.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						8. Changes to This Privacy Policy
					</h2>
					<p>
						We may update our Privacy Policy from time to time.
						Thus, you are advised to review this page periodically
						for any changes. We will notify you of any changes by
						posting the new Privacy Policy on this page. These
						changes are effective immediately after they are posted.
					</p>

					<h2 className="text-xl font-semibold mt-8 mb-4">
						9. Contact Us
					</h2>
					<p>
						If you have any questions or suggestions about our
						Privacy Policy, do not hesitate to contact us:
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
