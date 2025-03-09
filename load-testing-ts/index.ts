import { generateTestData } from './data-generator';
import { runLoadTests } from '../load-testing-py/load-tester';
import { visualizeResults } from '../load-testing-py/results-visualizer';

async function main() {
  // Step 1: Generate test data if needed
  await generateTestData();
  
  // Step 2: Run load tests
  const results = await runLoadTests();
  
  // Step 3: Visualize results
  await visualizeResults(results);
  
  console.log('Load testing completed successfully!');
}

main().catch(error => {
  console.error('Error during load testing:', error);
  process.exit(1);
}); 