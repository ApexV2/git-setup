#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { program } from 'commander';
import inquirerSearchList from 'inquirer-search-list';

// Documentation text
const shortDocs = `
${chalk.bold('Git Setup CLI')} - Quick repository setup tool

${chalk.yellow('Usage:')}
  git-setup -e    Express setup (basic configuration)
  git-setup -m    Manual setup (full configuration)
  git-setup -d    Show this documentation

${chalk.yellow('Express Setup Example:')}
  git-setup -e
  > What is the remote name? (origin)
  > What is the remote repository URL?
  > What is your main branch name? (main)
  > Initialize a new repository? (Y/n)

${chalk.yellow('Requirements:')}
  - Git installed on your system
  - Valid repository URL
`;

let res = await axios.get('https://api.github.com/gitignore/templates');

const GITIGNORE_TEMPLATES = res.data;

res = await axios.get('https://api.github.com/licenses')

const LICENSES = res.data;

async function expressSetup() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'remoteName',
                message: 'What is the remote name?',
                default: 'origin',
            },
            {
                type: 'input',
                name: 'remoteUrl',
                message: 'What is the remote repository URL?',
                validate: (input) =>
                    input.length > 0 || 'Remote URL is required',
            },
            {
                type: 'input',
                name: 'branchName',
                message: 'What is your main branch name?',
                default: 'main',
            },
            // {
            //     type: 'confirm',
            //     name: 'initializeRepo',
            //     message: 'Initialize a new repository?',
            //     default: true,
            // },
        ]);

        if (fs.existsSync(path.join(__dirname, '.git'))) {
            console.log(chalk.blue('Initializing git repository...'));
            execSync('git init');
        }

        console.log(chalk.blue('Adding remote repository...'));
        execSync(`git remote add ${answers.remoteName} ${answers.remoteUrl}`);

        console.log(chalk.blue(`Setting up ${answers.branchName} branch...`));
        execSync(`git switch -c ${answers.branchName}`);

        console.log(chalk.green('✨ Express setup completed!'));
        console.log(chalk.yellow('\nNext steps:'));
        console.log('1. Add your files: git add .');
        console.log(
            '2. Make your first commit: git commit -m "Initial commit"'
        );
        console.log(
            `3. Push to remote: git push -u ${answers.remoteName} ${answers.branchName}`
        );
    } catch (error) {
        console.error(chalk.red('Error setting up repository:'), error.message);
        process.exit(1);
    }
}

inquirer.registerPrompt('search-list', inquirerSearchList);

async function manualSetup() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'remoteName',
                message: 'What is the remote name?',
                default: 'origin',
            },
            {
                type: 'input',
                name: 'remoteUrl',
                message: 'What is the remote repository URL?',
                validate: (input) =>
                    input.length > 0 || 'Remote URL is required',
            },
            {
                type: 'input',
                name: 'branchName',
                message: 'What is your main branch name?',
                default: 'main',
            },
            // {
            //     type: 'confirm',
            //     name: 'initializeRepo',
            //     message: 'Initialize a new repository?',
            //     default: true
            // },
            {
                type: 'confirm',
                name: 'addGitignore',
                message: 'Would you like to add a .gitignore file?',
                default: true,
            },
            {
                type: 'search-list',
                name: 'gitignoreTemplate',
                message: 'Choose a .gitignore template (type to search):',
                choices: GITIGNORE_TEMPLATES,
                when: (answers) => answers.addGitignore,
            },
            {
                type: 'search-list',
                name: 'license',
                message: 'Choose a license for your repository:',
                choices: LICENSES,
                default: 'MIT',
            },
            {
                type: 'input',
                name: 'projectName',
                message: 'What is your project name?',
                default: process.cwd().split('/').pop(),
            },
            {
                type: 'input',
                name: 'description',
                message: 'Brief project description:',
                default: 'A new awesome project',
            },
            {
                type: 'confirm',
                name: 'initialCommit',
                message: 'Create initial commit?',
                default: true,
            },
        ]);

        if (fs.existsSync(path.join(__dirname, '.git'))) {
            console.log(chalk.blue('Initializing git repository...'));
            execSync('git init');
        }

        console.log(chalk.blue('Adding remote repository...'));
        execSync(`git remote add ${answers.remoteName} ${answers.remoteUrl}`);

        console.log(chalk.blue(`Setting up ${answers.branchName} branch...`));
        execSync(`git switch -c ${answers.branchName}`);

        if (answers.addGitignore) {
            await createGitignore(answers.gitignoreTemplate);
        }

        if (answers.license !== 'None') {
            await createLicense(answers.license);
        }

        if (answers.projectName && answers.description) {
            createReadme(answers);
        }

        if (answers.initialCommit) {
            console.log(chalk.blue('Creating initial commit...'));
            execSync('git add .');
            execSync('git commit -m "Initial commit"');
        }

        console.log(chalk.green('✨ Git repository setup completed!'));
        console.log(chalk.yellow('\nNext steps:'));
        console.log('1. Add your files: git add .');
        console.log(
            '2. Make your first commit: git commit -m "Initial commit"'
        );
        console.log(
            `3. Push to remote: git push -u ${answers.remoteName} ${answers.branchName}`
        );
    } catch (error) {
        console.error(chalk.red('Error setting up repository:'), error.message);
        process.exit(1);
    }
}

async function createGitignore(template) {
    try {
        const response = await axios.get(
            `https://raw.githubusercontent.com/github/gitignore/main/${template}.gitignore`
        );
        fs.writeFileSync('.gitignore', response.data);
        console.log(chalk.green('✨ Created .gitignore file'));
    } catch (error) {
        console.error(
            chalk.yellow('Warning: Could not create .gitignore file'),
            error.message
        );
    }
}

async function createLicense(license) {
    if (license === 'None') return;

    try {
        const response = await axios.get(
            `https://api.github.com/licenses/${license}`
        );
        fs.writeFileSync('LICENSE', response.data.body);
        console.log(chalk.green('✨ Created LICENSE file'));
    } catch (error) {
        console.error(
            chalk.yellow('Warning: Could not create LICENSE file'),
            error.message
        );
    }
}

function createReadme(answers) {
    const readme = `# ${answers.projectName}

${answers.description}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## License

This project is licensed under the ${answers.license} License - see the [LICENSE](LICENSE) file for details.
`;

    fs.writeFileSync('README.md', readme);
    console.log(chalk.green('✨ Created README.md file'));
}

const pjson = JSON.parse(fs.readFileSync('package.json'));

program
    .version(pjson.version)
    .description(pjson.description)
    .option('-h --help', 'Show documentation')
    .option('-d --documentation', 'Show documentation')
    .option('-m --manual', 'Manual Setup');

program.parse();

if (program.opts().help || program.opts().documentation) {
    console.log(shortDocs);
} else if (program.opts().manual) {
    manualSetup();
} else {
    expressSetup();
}
