const fs = require('fs');

// Read the file
const content = fs.readFileSync('/src/app/utils/courseData.ts', 'utf-8');

// Replace all credits patterns: 'X.XX-Y.YY' -> 'X.XX'
const updatedContent = content.replace(/credits: '(\d+\.\d+)-\d+\.\d+'/g, "credits: '$1'");

// Write back
fs.writeFileSync('/src/app/utils/courseData.ts', updatedContent, 'utf-8');

console.log('Done! All credits updated successfully.');
