import autocannon from 'autocannon';
import fs from 'fs/promises';
import path from 'path';
import { loginUser } from '@/actions/login';
import { submitQuiz, submitAnswer } from '@/actions/submit-answers';
import { getAllQuestions } from '@/actions/question';

// Define the phases for testing
const PHASES = [
  { connections: 50, name: 'Phase 1: 50 connections' },
  { connections: 100, name: 'Phase 2: 100 connections' },
  { connections: 150, name: 'Phase 3: 150 connections' },
  { connections: 200, name: 'Phase 4: 200 connections' },
  { connections: 250, name: 'Phase 5: 250 connections' },
  { connections: 300, name: 'Phase 6: 300 connections' },
  { connections: 350, name: 'Phase 7: 350 connections' },
  { connections: 400, name: 'Phase 8: 400 connections' },
  { connections: 450, name: 'Phase 9: 450 connections' },
  { connections: 500, name: 'Phase 10: 500 connections' }
];

// Endpoints to test
const ENDPOINTS = [
  { name: 'login', path: '/api/login', method: 'POST' },
  { name: 'getQuestions', path: '/api/questions', method: 'GET' },
  { name: 'submitAnswer', path: '/api/submit-answer', method: 'POST' },
  { name: 'submitQuiz', path: '/api/submit-quiz', method: 'POST' }
];

// Load test a specific endpoint with a specific number of connections
async function loadTestEndpoint(endpoint: any, connections: number) {
  console.log(`Testing ${endpoint.name} with ${connections} connections...`);
  
  const instance = autocannon({
    url: `http://localhost:3000${endpoint.path}`,
    connections,
    duration: 30, // 30 seconds per test
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json'
    },
    setupClient: (client: any) => {
      // Add any client setup logic here
      client.on('response', (statusCode: number, resBytes: number, responseTime: number) => {
        // Log response metrics if needed
      });
    }
  });
  
  return new Promise<any>((resolve) => {
    autocannon.track(instance);
    
    instance.on('done', (results) => {
      console.log(`Completed testing ${endpoint.name} with ${connections} connections`);
      resolve(results);
    });
  });
}

// Run all load tests
export async function runLoadTests() {
  console.log('Starting load tests...');
  
  const results = [];
  const resultsDir = path.join(process.cwd(), 'load-testing', 'results');
  
  // Ensure results directory exists
  await fs.mkdir(resultsDir, { recursive: true });
  
  // Run tests for each phase
  for (const phase of PHASES) {
    console.log(`\n=== Starting ${phase.name} ===\n`);
    
    const phaseResults = {
      phase: phase.name,
      connections: phase.connections,
      endpoints: [] as any[]
    };
    
    // Test each endpoint in this phase
    for (const endpoint of ENDPOINTS) {
      const endpointResult = await loadTestEndpoint(endpoint, phase.connections);
      
      phaseResults.endpoints.push({
        name: endpoint.name,
        result: {
          requests: {
            average: endpointResult.requests.average,
            min: endpointResult.requests.min,
            max: endpointResult.requests.max
          },
          latency: {
            average: endpointResult.latency.average,
            min: endpointResult.latency.min,
            max: endpointResult.latency.max,
            p50: endpointResult.latency.p50,
            p90: endpointResult.latency.p90,
            p99: endpointResult.latency.p99
          },
          throughput: {
            average: endpointResult.throughput.average,
            min: endpointResult.throughput.min,
            max: endpointResult.throughput.max
          },
          errors: endpointResult.errors,
          timeouts: endpointResult.timeouts,
          non2xx: endpointResult.non2xx,
          statusCodeStats: endpointResult.statusCodeStats
        }
      });
      
      // Save individual endpoint result
      await fs.writeFile(
        path.join(resultsDir, `${phase.connections}-${endpoint.name}.json`),
        JSON.stringify(endpointResult, null, 2)
      );
    }
    
    results.push(phaseResults);
    
    // Save phase results
    await fs.writeFile(
      path.join(resultsDir, `phase-${phase.connections}.json`),
      JSON.stringify(phaseResults, null, 2)
    );
    
    console.log(`\n=== Completed ${phase.name} ===\n`);
  }
  
  // Save all results
  await fs.writeFile(
    path.join(resultsDir, 'all-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('All load tests completed');
  return results;
} 