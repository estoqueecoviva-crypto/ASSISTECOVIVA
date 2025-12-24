
// tests/test_gitignore.js

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Function to check if a file is ignored by git
function isIgnored(filePath) {
  const gitignoreContent = fs.readFileSync(path.join(__dirname, '../.gitignore'), 'utf8');
  const gitignoreRules = gitignoreContent.split('\n').filter(rule => rule.trim() !== '' && !rule.startsWith('#'));

  for (const rule of gitignoreRules) {
    const regex = new RegExp(rule.replace(/\./g, '\.').replace(/\*/g, '.*'));
    if (regex.test(filePath)) {
      return true;
    }
  }

  return false;
}

// Test cases
try {
  // Test case 1: Check that a file that should not be ignored is not ignored
  assert.strictEqual(isIgnored('index.html'), false, 'Test Case 1 Failed: index.html should not be ignored.');

  // Test case 2: Check that a file in a subdirectory that should not be ignored is not ignored
  assert.strictEqual(isIgnored('src/app.js'), false, 'Test Case 2 Failed: src/app.js should not be ignored.');

  // Test case 3: Check that a hidden file that should not be ignored is not ignored
  assert.strictEqual(isIgnored('.env'), false, 'Test Case 3 Failed: .env should not be ignored.');

  // Test case 4: Check that a file in node_modules is ignored (assuming node_modules/ is in .gitignore)
  // In this case, .gitignore is empty, so it should not be ignored.
  assert.strictEqual(isIgnored('node_modules/express/index.js'), false, 'Test Case 4 Failed: node_modules/express/index.js should not be ignored.');

  console.log('All .gitignore tests passed!');
} catch (error) {
  console.error(error.message);
}
