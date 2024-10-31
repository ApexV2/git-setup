#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');
const chalk = require('chalk');

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

setupGitRepo(); 