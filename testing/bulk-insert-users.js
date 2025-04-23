import fs from 'fs';
import http from 'http';

// Read the test users data
const users = JSON.parse(fs.readFileSync('./test-users.json', 'utf8'));

// Function to make API request
function makeRequest(user) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify([{
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      rollNo: user.rollNo,
      schoolName: user.schoolName,
      branch: user.branch,
      address: user.address,
      password: user.password
    }]);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/register',
      method: 'POST',
      headers: {
        'accept': 'text/x-component',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'content-type': 'text/plain;charset=UTF-8',
        'next-action': '4035f9d4f0f6f9fbc3260077ce7f4e3a45b030bab5',
        'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22(auth)%22%2C%7B%22children%22%3A%5B%22register%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fregister%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'Referer': 'http://localhost:3000/register',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          // Log the raw response for debugging
          console.log(`Raw response for ${user.email}:`, responseData);
          
          // Check if the response indicates success
          const success = !responseData.includes('error');
          resolve({
            success,
            user: user.email,
            response: responseData
          });
        } catch (error) {
          console.error(`Error processing response for ${user.email}:`, error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Request error for ${user.email}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function bulkInsertUsers() {
  const results = {
    success: 0,
    failed: 0,
    details: []
  };

  // Process users in batches of 10
  const batchSize = 10;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const batchPromises = batch.map(async (user) => {
      try {
        const result = await makeRequest(user);
        return result;
      } catch (error) {
        return {
          success: false,
          user: user.email,
          error: error.message
        };
      }
    });

    // Wait for all users in batch to be processed
    const batchResults = await Promise.all(batchPromises);
    
    // Update results
    batchResults.forEach(result => {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
      }
      results.details.push(result);
    });

    // Log progress
    console.log(`Processed ${i + batch.length} of ${users.length} users`);
    console.log(`Success: ${results.success}, Failed: ${results.failed}`);
  }

  return results;
}

// Main execution
async function main() {
  console.log('Starting bulk user registration...');
  console.log(`Total users to register: ${users.length}`);

  const startTime = Date.now();
  const results = await bulkInsertUsers();
  const endTime = Date.now();

  console.log('\nRegistration Summary:');
  console.log(`Total time taken: ${(endTime - startTime) / 1000} seconds`);
  console.log(`Successful registrations: ${results.success}`);
  console.log(`Failed registrations: ${results.failed}`);

  // Save detailed results to a file
  fs.writeFileSync(
    './bulk-insert-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\nDetailed results saved to bulk-insert-results.json');
}

main().catch(error => {
  console.error('Error in main execution:', error);
}); 