# 🎓 Online Examination System

A secure and seamless platform for conducting online exams.

## 📋 Overview

This online examination system provides educational institutions with a robust platform to conduct secure online exams. The system is designed to ensure academic integrity while offering an intuitive experience for both administrators and students.

## ✨ Features

### 👨‍💼 For Administrators

-   👥 User management (add, edit, delete users)
-   📝 Exam creation and scheduling
-   🗃️ Question bank management
-   👁️ Real-time monitoring
-   📊 Comprehensive reporting and analytics
-   🔐 Secure authentication

### 👨‍🎓 For Students

-   🖱️ Simple exam access and navigation
-   ⏱️ Clear instructions and time tracking
-   ❓ Support for various question types (MCQ, written, file upload)
-   ⚡ Instant feedback (for automated assessments)
-   🔒 Secure login and session management

## 🛠️ Technology Stack

-   🌐 **Frontend**: React.js, Next.js, Tailwind CSS
-   🖥️ **Backend**: Node.js, Express
-   🗄️ **Database**: MongoDB
-   🔑 **Authentication**: JWT
-   🛡️ **Security**: Data encryption, anti-cheating measures

## 🔒 Security Measures

-   🔐 Secure authentication and authorization
-   📡 Session management
-   🔍 Browser lockdown capabilities
-   🕵️ Plagiarism detection
-   🔀 Randomized question order
-   ⏲️ Time restrictions
-   📹 Webcam proctoring options

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/online-examination-system.git

# Navigate to project directory
cd online-examination-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

## 📚 Usage

1. 👤 Set up administrator account
2. 🏫 Create courses and enroll students
3. 📋 Create question banks
4. 📅 Schedule exams
5. 📊 Monitor exams in real-time
6. 📈 Generate and review reports

## 📷 Screenshots

### HomePage

![HomePage](./screenshots/homepage.png)

### SubjectSelection

![SubjectSelection](./screenshots/subject-selection.png)

### QuestionPage

![QuestionPage](./screenshots/quiz.png)

### ResultPage

![ResultPage](./screenshots/result.png)

### Leaderboard

![Leaderboard](./screenshots/leaderboard.png)

### Career Guidance

![Career Guidance](./screenshots/career-guidance.png)

### Admin Dashboard Add Question

![Admin Dashboard Add Question](./screenshots/admin-add-question.png)

### Admin Dashboard List User

![Admin Dashboard List User](./screenshots/admin-list-question.png)

## Database Setup

This application uses PostgreSQL with Drizzle ORM. Follow these steps to set up your database:

### 1. Install PostgreSQL

Install PostgreSQL on your local machine or set up a PostgreSQL instance on a cloud provider.

### 2. Create Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# PostgreSQL Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/quiz_app

# AWS S3 Configuration
S3_ACCESS_KEY_ID=your_s3_access_key_id
S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
S3_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

Replace the `DATABASE_URL` with your actual PostgreSQL connection string and add your AWS S3 credentials.

### 3. Setting Up Document Storage (AWS S3 or DigitalOcean Spaces)

This application supports both AWS S3 and DigitalOcean Spaces for document uploads.

#### Option 1: AWS S3 Configuration

1. **Create an AWS Account**: If you don't have one already, sign up at [aws.amazon.com](https://aws.amazon.com).

2. **Create an S3 Bucket**:

    - Go to the S3 service in the AWS Management Console
    - Click "Create bucket"
    - Choose a globally unique bucket name
    - Select the region closest to your users
    - Configure bucket settings (public access recommended to be blocked)
    - Enable CORS if needed for your application

3. **Create IAM User for Access**:

    - Go to the IAM service
    - Create a new user with programmatic access
    - Attach the `AmazonS3FullAccess` policy (or create a custom policy with more restrictive permissions)
    - Save the access key ID and secret access key

4. **Update Environment Variables**:
    ```
    # AWS S3 Configuration
    S3_ACCESS_KEY_ID=your_s3_access_key_id
    S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
    S3_REGION=us-east-1
    S3_ENDPOINT=https://s3.amazonaws.com
    S3_BUCKET_NAME=your-bucket-name
    ```

#### Option 2: DigitalOcean Spaces Configuration

1. **Create a DigitalOcean Account**: Sign up at [digitalocean.com](https://digitalocean.com) if you don't have an account.

2. **Create a Space**:

    - Go to the Spaces section in your DigitalOcean dashboard
    - Click "Create a Space"
    - Select a region close to your users
    - Choose a unique name for your Space
    - Configure CDN if needed for better performance

3. **Create API Keys**:

    - In your DigitalOcean account, go to API > Tokens/Keys
    - Generate new Spaces access keys
    - Save both the access key and secret

4. **Update Environment Variables**:
    ```
    # DigitalOcean Spaces Configuration
    S3_ACCESS_KEY_ID=your_spaces_access_key
    S3_SECRET_ACCESS_KEY=your_spaces_secret_key
    S3_ENDPOINT=https://your-space-name.region.digitaloceanspaces.com
    S3_BUCKET_NAME=your-space-name
    S3_REGION=region-code
    CDN_S3_ORIGIN_URL=https://your-cdn-url.example.com  # Only if CDN is enabled
    ```

### 4. Push the Schema to Your Database

Run the following command to create the database tables:

```bash
# Generate the schema
npm run db:generate

# Migrate the schema to the database
npm run db:migrate
```

### 5. Explore Your Database (Optional)

You can use Drizzle Studio to explore your database:

```bash
npm run db:studio
```

This will start a local web interface at http://localhost:3333 where you can view and edit your database.

## Migrating from MongoDB to PostgreSQL

If you're migrating from the previous MongoDB setup, you'll need to manually transfer your data. Here's a basic process:

1. Export your data from MongoDB
2. Transform the data to match the new schema
3. Import the data into PostgreSQL

Note that IDs have changed from MongoDB's ObjectID to UUID format, so you'll need to update any hardcoded IDs in your application.

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 📩 Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

-   👨‍💻 All contributors and testers
-   📦 Open source libraries used in this project
