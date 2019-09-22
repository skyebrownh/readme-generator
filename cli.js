#!/usr/bin/env node

// grab provided args
const [,, ... args] = process.argv

if (args[0] != 'new') {
  console.warn(`You\'re command argument could not be recognized. Please try again using one of the following:
    - readme new: generates / replaces a new readme file from a template
  `);
  process.exit(2);
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');

question1();

// check if user is in desired directory
function question1() {
  readline.question('Are you currently within the directory where you would like your README.md file to live? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      question2();
    } else if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
      console.log('Please navigate to your desired directory and try again. Exiting...');
      process.exit();
    } else {
      console.log('Sorry, you\'re response wasn\'t understood. Try again.\n\n');
      question1();
    }
  });
}

function question2() {
  // check if readme already exists
  const haveReadme = fs.existsSync('./README.md');
  if (haveReadme) {
    // file exists: check for override permission
    readline.question('README.md file exists: would you like for you\'re current file to be overriden? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('Override Permission Granted.\n\n');
        question4();
      } else if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
        console.log('Override Permission Denied.\n\n');
        // check if user wants to create new & different README file
        question3();
      } else {
        console.log('Sorry, you\'re response wasn\'t understood. Try again.\n\n');
        question2();
      }
    }); 
  } else {
    // file doesn't exist: create new file
    console.log('README.md file doesn\'t exist: creating new file...');
    question4();
  }
}

function question3() {
  readline.question('Would you like to create a new README and keep your existing file or exit? [keep (k)/exit (e)] ', (answer) => {
      if (answer.toLowerCase() === 'k' || answer.toLowerCase() === 'keep') {
        console.log('New File Permission Granted');
        question4();
      } else if (answer.toLowerCase() === 'e' || answer.toLowerCase() === 'exit') {
        console.log('Exiting...');
        process.exit();
      } else {
        console.log('Sorry, you\'re response wasn\'t understood. Try again.\n\n');
        question3();
      }
  });
}

function question4() {
  readline.question('What would you like to name your file (default: README.md)? Please provide name and extension: ', (filename) => {
    // create new file with filename or README.md
    fs.copyFile('./README-template.md', filename || './README.md', (err) => {
      if (err) {
        console.error('There was an error writing to a new README file: ', err, 'Please try again.\n\nExiting...');
        process.exit(1);
      } else {
        console.log('Process complete.');
        readline.close();
        process.exit();
      }
    });
  });
}