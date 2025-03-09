import os
import argparse
import subprocess
import asyncio

def setup_environment():
    """Install required packages"""
    print("Installing required packages...")
    subprocess.run(["pip", "install", "faker", "argon2-cffi", "pymongo", "pandas", "matplotlib", "seaborn", "tqdm", "aiohttp", "locust"])
    
    # Create load-testing directory if it doesn't exist
    if not os.path.exists("load-testing"):
        os.makedirs("load-testing")

def run_direct_load_test():
    """Run the direct database load test"""
    print("\n=== Running Direct Database Load Test ===")
    asyncio.run(subprocess.run(["python", "load-testing/direct_load_test.py"]))

def run_http_load_test():
    """Run the HTTP-based load test using Locust"""
    print("\n=== Running HTTP-based Load Test with Locust ===")
    subprocess.run(["locust", "-f", "load-testing/locustfile.py", "--headless", "-u", "500", "-r", "50", "--run-time", "10m"])

def main():
    parser = argparse.ArgumentParser(description="Run load tests for the quiz application")
    parser.add_argument("--mode", choices=["direct", "http", "all"], default="all", help="Load test mode")
    args = parser.parse_args()
    
    # Setup environment
    setup_environment()
    
    # Generate test data
    print("Generating test data...")
    subprocess.run(["python", "load-testing/generate_test_data.py"])
    
    # Run load tests based on mode
    if args.mode in ["direct", "all"]:
        run_direct_load_test()
    
    if args.mode in ["http", "all"]:
        run_http_load_test()
    
    print("\n=== Load Testing Complete ===")
    print("Results and visualizations are available in the load-testing directory")

if __name__ == "__main__":
    main() 