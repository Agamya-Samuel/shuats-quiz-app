const fs = require("fs");

const schools = [
  "SHUATS University",
  "Delhi Public School",
  "Kendriya Vidyalaya",
  "St. Xavier's School",
  "Modern Public School",
  "Central Academy",
  "Sunshine International School",
  "Global Public School",
  "Bright Future Academy",
  "Elite International School",
];

const branches = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Information Technology",
  "Biotechnology",
  "Chemical",
  "Aerospace",
  "Environmental",
];

const cities = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

function generateUser(index) {
  const schoolIndex = Math.floor(Math.random() * schools.length);
  const branchIndex = Math.floor(Math.random() * branches.length);
  const cityIndex = Math.floor(Math.random() * cities.length);

  return {
    email: `user${index}@test.com`,
    name: `User${index} Test${index}`,
    mobile: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
    rollNo: `R${1000 + index}`,
    schoolName: schools[schoolIndex],
    branch: branches[branchIndex],
    address: `${Math.floor(Math.random() * 100) + 1} ${
      cities[cityIndex]
    } Street, ${cities[cityIndex]}, India`,
    password: `Test@${index}`,
  };
}

// Read existing users
const existingUsers = JSON.parse(fs.readFileSync("./test-users.json", "utf8"));

// Generate new users
const newUsers = [];
for (let i = 11; i <= 500; i++) {
  newUsers.push(generateUser(i));
}

// Combine existing and new users
const allUsers = [...existingUsers, ...newUsers];

// Write back to file
fs.writeFileSync("./test-users.json", JSON.stringify(allUsers, null, 2));

console.log("Successfully generated 500 users!");
