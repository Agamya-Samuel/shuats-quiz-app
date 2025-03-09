import fs from 'fs/promises';
import path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

// Create charts for visualizing results
export async function visualizeResults(results: any[]) {
  console.log('Visualizing results...');
  
  const resultsDir = path.join(process.cwd(), 'load-testing', 'results');
  const chartsDir = path.join(resultsDir, 'charts');
  
  // Ensure charts directory exists
  await fs.mkdir(chartsDir, { recursive: true });
  
  // Create a chart for average latency across all phases
  await createLatencyChart(results, chartsDir);
  
  // Create a chart for throughput across all phases
  await createThroughputChart(results, chartsDir);
  
  // Create a chart for error rates across all phases
  await createErrorRateChart(results, chartsDir);
  
  // Create HTML report
  await createHtmlReport(results, resultsDir);
  
  console.log('Results visualization completed');
}

// Create a chart for average latency
async function createLatencyChart(results: any[], outputDir: string) {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
  const labels = results.map(r => r.connections);
  const datasets = [];
  
  // Get all unique endpoint names
  const endpointNames = [...new Set(
    results.flatMap(r => r.endpoints.map((e: any) => e.name))
  )];
  
  // Create a dataset for each endpoint
  for (const endpointName of endpointNames) {
    const data = results.map(r => {
      const endpoint = r.endpoints.find((e: any) => e.name === endpointName);
      return endpoint ? endpoint.result.latency.average : 0;
    });
    
    datasets.push({
      label: endpointName,
      data,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    });
  }
  
  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Average Latency (ms)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Number of Connections'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Average Latency by Endpoint and Connection Count'
        }
      }
    }
  };
  
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await fs.writeFile(path.join(outputDir, 'latency-chart.png'), image);
}

// Create a chart for throughput
async function createThroughputChart(results: any[], outputDir: string) {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
  const labels = results.map(r => r.connections);
  const datasets = [];
  
  // Get all unique endpoint names
  const endpointNames = [...new Set(
    results.flatMap(r => r.endpoints.map((e: any) => e.name))
  )];
  
  // Create a dataset for each endpoint
  for (const endpointName of endpointNames) {
    const data = results.map(r => {
      const endpoint = r.endpoints.find((e: any) => e.name === endpointName);
      return endpoint ? endpoint.result.throughput.average : 0;
    });
    
    datasets.push({
      label: endpointName,
      data,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    });
  }
  
  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Throughput (req/sec)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Number of Connections'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Average Throughput by Endpoint and Connection Count'
        }
      }
    }
  };
  
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await fs.writeFile(path.join(outputDir, 'throughput-chart.png'), image);
}

// Create a chart for error rates
async function createErrorRateChart(results: any[], outputDir: string) {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  
  const labels = results.map(r => r.connections);
  const datasets = [];
  
  // Get all unique endpoint names
  const endpointNames = [...new Set(
    results.flatMap(r => r.endpoints.map((e: any) => e.name))
  )];
  
  // Create a dataset for each endpoint
  for (const endpointName of endpointNames) {
    const data = results.map(r => {
      const endpoint = r.endpoints.find((e: any) => e.name === endpointName);
      if (!endpoint) return 0;
      
      const totalRequests = endpoint.result.requests.total || 1;
      const errors = endpoint.result.errors || 0;
      const non2xx = endpoint.result.non2xx || 0;
      
      return ((errors + non2xx) / totalRequests) * 100;
    });
    
    datasets.push({
      label: endpointName,
      data,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    });
  }
  
  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Error Rate (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Number of Connections'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Error Rate by Endpoint and Connection Count'
        }
      }
    }
  };
  
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await fs.writeFile(path.join(outputDir, 'error-rate-chart.png'), image);
}

// Create an HTML report with all the results
async function createHtmlReport(results: any[], outputDir: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Application Load Test Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .chart-container {
      margin: 30px 0;
      text-align: center;
    }
    .chart-container img {
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px 15px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .summary {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Quiz Application Load Test Results</h1>
    
    <div class="summary">
      <h2>Test Summary</h2>
      <p>This report shows the results of load testing the Quiz Application with varying numbers of concurrent connections.</p>
      <p>Testing was conducted in ${results.length} phases, from ${results[0].connections} to ${results[results.length-1].connections} concurrent connections.</p>
    </div>
    
    <div class="chart-container">
      <h2>Latency Results</h2>
      <img src="./charts/latency-chart.png" alt="Latency Chart">
    </div>
    
    <div class="chart-container">
      <h2>Throughput Results</h2>
      <img src="./charts/throughput-chart.png" alt="Throughput Chart">
    </div>
    
    <div class="chart-container">
      <h2>Error Rate Results</h2>
      <img src="./charts/error-rate-chart.png" alt="Error Rate Chart">
    </div>
    
    <h2>Detailed Results by Phase</h2>
    
    ${results.map(phase => `
      <h3>${phase.phase}</h3>
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Avg Latency (ms)</th>
            <th>Min Latency (ms)</th>
            <th>Max Latency (ms)</th>
            <th>P99 Latency (ms)</th>
            <th>Requests/sec</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          ${phase.endpoints.map((endpoint: any) => `
            <tr>
              <td>${endpoint.name}</td>
              <td>${endpoint.result.latency.average.toFixed(2)}</td>
              <td>${endpoint.result.latency.min.toFixed(2)}</td>
              <td>${endpoint.result.latency.max.toFixed(2)}</td>
              <td>${endpoint.result.latency.p99.toFixed(2)}</td>
              <td>${endpoint.result.requests.average.toFixed(2)}</td>
              <td>${endpoint.result.errors || 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `).join('')}
    
    <h2>Conclusions</h2>
    <div id="conclusions">
      <p>Based on the test results, the following conclusions can be drawn:</p>
      <ul>
        <li>The application performs best under [X] concurrent connections.</li>
        <li>Response times begin to degrade significantly at [Y] concurrent connections.</li>
        <li>The [Z] endpoint shows the highest latency under load.</li>
        <li>Recommended maximum concurrent users: [N]</li>
      </ul>
      <p>Note: The conclusions section should be filled in manually after analyzing the test results.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  await fs.writeFile(path.join(outputDir, 'report.html'), html);
}

// Helper function to generate random colors for charts
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
} 