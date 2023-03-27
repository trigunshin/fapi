const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

const checkoutBranch = 'publ3';
const buildDir = 'build';

// Move to the root of the repository
process.chdir(path.resolve(__dirname));

// Checkout to the gh-pages branch or create it if it doesn't exist
try {
    execSync(`git checkout ${checkoutBranch}`);
} catch (error) {
    execSync(`git checkout -b ${checkoutBranch}`);
}

// Remove all files except for .gitignore and README.md
fs.readdirSync('.').forEach((file) => {
    if (file !== '.git' && file !== '.gitignore' && file !== 'README.md') {
        fs.removeSync(file);
    }
});

// Copy build files to the root directory
fs.copySync(buildDir, '.');

// Add and commit the changes
execSync('git add .');
execSync('git commit -m "Update GitHub Pages"');

// Return to the main branch (replace "main" with your main branch name if different)
execSync('git checkout main');

console.log('Deployment commit created. You can now push the changes to the remote repository.');
