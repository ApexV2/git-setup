#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Documentation text
const shortDocs = `
${chalk.bold('Git Setup CLI')} - Quick repository setup tool

${chalk.yellow('Usage:')}
  git-setup -s    Start the setup process
  git-setup -d    Show this documentation

${chalk.yellow('Example:')}
  git-setup -s
  > What is the remote name? (origin)
  > What is the remote repository URL? https://github.com/username/repo.git
  > What is your main branch name? (main)
  > Initialize a new repository? (Y/n)

${chalk.yellow('Requirements:')}
  - Git installed on your system
  - Valid repository URL
`;

async function setupGitRepo() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'remoteName',
                message: 'What is the remote name?',
                default: 'origin'
            },
            {
                type: 'input',
                name: 'remoteUrl',
                message: 'What is the remote repository URL?',
                validate: input => input.length > 0 || 'Remote URL is required'
            },
            {
                type: 'input',
                name: 'branchName',
                message: 'What is your main branch name?',
                default: 'main'
            },
            {
                type: 'confirm',
                name: 'initializeRepo',
                message: 'Initialize a new repository?',
                default: true
            }
        ]);

        if (answers.initializeRepo) {
            console.log(chalk.blue('Initializing git repository...'));
            execSync('git init');
        }

        console.log(chalk.blue('Adding remote repository...'));
        execSync(`git remote add ${answers.remoteName} ${answers.remoteUrl}`);

        console.log(chalk.blue(`Setting up ${answers.branchName} branch...`));
        execSync(`git switch -c ${answers.branchName}`);

        console.log(chalk.green('✨ Git repository setup completed!'));
        console.log(chalk.yellow('\nNext steps:'));
        console.log('1. Add your files: git add .');
        console.log('2. Make your first commit: git commit -m "Initial commit"');
        console.log(`3. Push to remote: git push -u ${answers.remoteName} ${answers.branchName}`);

    } catch (error) {
        console.error(chalk.red('Error setting up repository:'), error.message);
        process.exit(1);
    }
}

// Main function to handle command line arguments
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        console.log(chalk.red('Error: Missing required argument\n'));
        console.log(shortDocs);
        process.exit(1);
    }

    switch (args[0]) {
        case '-s':
            setupGitRepo();
            break;
        case '-d':
            console.log(shortDocs);
            break;
        default:
            console.log(chalk.red('Error: Invalid argument\n'));
            console.log(shortDocs);
            process.exit(1);
    }
}

// Run the program
main(); 