#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { program } = require('commander');

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

const GITIGNORE_TEMPLATES = [
    'Node.js',
    'Python',
    'Java',
    'Ruby',
    'Go',
    'Visual Studio Code',
    'JetBrains',
    'macOS',
    'Windows',
];

const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'None'];

async function setupGitRepo() {
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
                type: 'list',
                name: 'gitignoreTemplate',
                message: 'Choose a .gitignore template:',
                choices: GITIGNORE_TEMPLATES,
                when: (answers) => answers.addGitignore,
            },
            {
                type: 'list',
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

const pjson = require('../package.json');

program
    .version(pjson.version)
    .description(pjson.description)
    .option('-h --help', 'Show documentation');

program.parse();

if (program.opts().help) {
    console.log(shortDocs);
    process.exit(0);
}

setupGitRepo();
