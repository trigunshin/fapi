const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

const buildDir = 'build';

// Move to the root of the repository
process.chdir(path.resolve(__dirname));
execSync('git checkout ghpages2');

// Copy build files to the root directory
fs.copySync(buildDir, 'docs/');

// Add and commit the changes
execSync('git add docs');
execSync('git commit -m "Update GitHub Pages"');

// Return to the main branch (replace "main" with your main branch name if different)
execSync('git checkout master');

console.log('Deployment commit created. You can now push the changes to the remote repository.');
