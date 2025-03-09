{
  "scripts": {
    "load-test:generate": "ts-node -r tsconfig-paths/register load-testing/data-generator.ts",
    "load-test:run": "ts-node -r tsconfig-paths/register load-testing/load-tester.ts",
    "load-test:visualize": "ts-node -r tsconfig-paths/register load-testing/results-visualizer.ts",
    "load-test": "ts-node -r tsconfig-paths/register load-testing/index.ts"
  },
  "dependencies": {
    "autocannon": "^7.11.0",
    "chartjs-node-canvas": "^4.1.6"
  }
} 