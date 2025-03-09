# Quiz Application Load Testing Documentation

This documentation provides instructions for load testing the quiz application using the Python scripts in the `load-testing-py` directory.

## Overview

The load testing suite consists of several Python scripts designed to:

1. Generate test data (questions and users)
2. Register users and add questions to the database
3. Run load tests with increasing numbers of concurrent users
4. Analyze and visualize the results

## Prerequisites

- Python 3.7+
- MongoDB
- The quiz application running locally or on a server

## Installation

1. Install the required Python packages:

```bash
pip install faker argon2-cffi pymongo pandas matplotlib seaborn tqdm aiohttp locust
```

2. Make sure the `load-testing` directory exists (it will be created automatically by the scripts if needed).

## Scripts Overview

The load testing suite includes the following scripts:

- `generate_test_data.py`: Generates random questions and users
- `setup_test_data.py`: Registers users and adds questions via API
- `direct_load_test.py`: Performs load testing directly against the MongoDB database
- `load_test.py`: Performs HTTP-based load testing via the application's API
- `locustfile.py`: Locust configuration for more advanced HTTP-based load testing
- `run_load_test.py`: Main script to run all load tests

## Load Testing Process

### Step 1: Generate Test Data

The `generate_test_data.py` script creates:
- 500 random quiz questions with options and correct answers
- 500 random user profiles for registration

```bash
python load-testing-py/generate_test_data.py
```

This will save the generated data to:
- `load-testing/questions.json`
- `load-testing/users.json`

### Step 2: Setup Test Data

The `setup_test_data.py` script registers the generated users and adds the questions to the database via the application's API:

```bash
python load-testing-py/setup_test_data.py
```

**Note:** You'll need to update the admin credentials in this script to match your application's admin user.

### Step 3: Run Load Tests

You can run the load tests in different modes:

#### Direct Database Load Test

This test bypasses the application's API and interacts directly with the MongoDB database:

```bash
python load-testing-py/direct_load_test.py
```

The test will:
1. Generate and insert test data directly into the database
2. Run load tests in phases (50, 100, 150, ..., 500 concurrent users)
3. Measure response times for each phase
4. Generate visualizations of the results

#### HTTP-based Load Test

This test interacts with the application via its API:

```bash
python load-testing-py/load_test.py
```

The test will:
1. Load test data from JSON files
2. Login users via the API
3. Submit quiz answers concurrently
4. Measure response times for each phase
5. Generate visualizations of the results

#### Locust Load Test

For more advanced load testing with real-time monitoring:

```bash
locust -f load-testing-py/locustfile.py
```

Then open http://localhost:8089 in your browser to configure and start the test.

### Step 4: Run All Tests with the Main Script

To run all tests in sequence:

```bash
python load-testing-py/run_load_test.py
```

You can also specify which test mode to run:

```bash
python load-testing-py/run_load_test.py --mode direct  # Only run direct database test
python load-testing-py/run_load_test.py --mode http    # Only run HTTP-based test
python load-testing-py/run_load_test.py --mode all     # Run all tests (default)
```

## Test Phases

Each load test runs in phases with increasing numbers of concurrent users:

1. 50 concurrent users
2. 100 concurrent users
3. 150 concurrent users
4. ...and so on up to 500 concurrent users

For each phase, the test measures:
- Minimum response time
- Maximum response time
- Average response time
- Median response time
- Success rate

## Results and Visualization

After running the tests, the following files will be generated in the `load-testing` directory:

- `results.csv`: CSV file with response time statistics for each phase
- `response_times.png`: Visualization of response times vs. concurrent users
- `success_rate.png`: Visualization of success rate vs. concurrent users

The visualizations help identify:
- How response times scale with increasing load
- At what point the application's performance degrades
- Whether there are any failures under load

## Customization

You can customize the tests by modifying the following parameters:

- In `direct_load_test.py` and `load_test.py`:
  - `PHASES`: List of concurrent user counts for each phase
  - `MONGODB_URI`: Connection string for your MongoDB database
  - `DB_NAME`: Name of your database

- In `generate_test_data.py`:
  - `SUBJECTS`: List of subject areas for generated questions
  - Number of questions and users to generate

## Troubleshooting

- If you encounter connection errors, make sure your application is running and accessible at the URL specified in `BASE_URL`.
- If user registration fails, check that your application's registration endpoint is working correctly.
- If admin login fails, update the admin credentials in `setup_test_data.py`.
- If you see MongoDB connection errors, verify your MongoDB connection string and ensure the database is running.

## Interpreting Results

When analyzing the results:

1. Look for the point where response times start to increase significantly - this is your application's performance threshold.
2. Check if the success rate drops at higher concurrency levels - this indicates errors under load.
3. Compare min, max, and average response times to understand the consistency of your application's performance.
4. Use the box plots to identify outliers and understand the distribution of response times.

This information will help you determine how many concurrent users your application can handle reliably and where optimizations might be needed.
