#!/usr/bin/env node

import { input, search, confirm } from "@inquirer/prompts";
import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import axios from "axios";
import path from "path";
import { program } from "commander";

// Documentation text
const shortDocs = `
${chalk.bold("Git Setup CLI")} - Quick repository setup tool

${chalk.yellow("Usage:")}
  git-setup -e    Express setup (basic configuration)
  git-setup -m    Manual setup (full configuration)
  git-setup -d    Show this documentation

${chalk.yellow("Express Setup Example:")}
  git-setup -e
  > What is the remote name? (origin)
  > What is the remote repository URL?
  > What is your main branch name? (main)
  > Initialize a new repository? (Y/n)

${chalk.yellow("Requirements:")}
  - Git installed on your system
  - Valid repository URL
`;

async function expressSetup() {
    try {
        const remoteName = input({
            message: "What is the remote name?",
            default: "origin",
        });
        const remoteUrl = input({
            message: "What is the remote repository URL?",
            validate: (input) => input.length > 0 || "Remote URL is required",
        });
        const branchName = input({
            message: "What is your main branch name?",
            default: "main",
        });

        if (fs.existsSync(path.join(__dirname, ".git"))) {
            console.log(chalk.blue("Initializing git repository..."));
            execSync("git init");
        }

        console.log(chalk.blue("Adding remote repository..."));
        execSync(`git remote add ${remoteName} ${remoteUrl}`);

        console.log(chalk.blue(`Setting up ${branchName} branch...`));
        execSync(`git switch -c ${branchName}`);

        console.log(chalk.green("✨ Express setup completed!"));
        console.log(chalk.yellow("\nNext steps:"));
        console.log("1. Add your files: git add .");
        console.log(
            '2. Make your first commit: git commit -m "Initial commit"'
        );
        console.log(
            `3. Push to remote: git push -u ${remoteName} ${branchName}`
        );
    } catch (error) {
        console.error(chalk.red("Error setting up repository:"), error);
        process.exit(1);
    }
}

async function manualSetup() {
    try {
        const remoteName = await input({
            message: "What is the remote name?",
            default: "origin",
        });
        const remoteUrl = await input({
            message: "What is the remote repository URL?",
            validate: (input) => input.length > 0 || "Remote URL is required",
        });
        const branchName = await input({
            message: "What is your main branch name?",
            default: "main",
        });
        const addGitignore = await confirm({
            message: "Would you like to add a .gitignore file?",
            default: true,
        });
        let gitignoreTemplate: any;
        if (addGitignore) {
            let templates: any;
            const gitignoreTemplate = await search({
                message: "Choose a .gitignore template (type to search):",
                source: async (term: string | undefined, { signal }: { signal: AbortSignal }) => {
                    if (!templates) {
                        try {
                            let res = await axios.get("https://api.github.com/gitignore/templates");
                            templates = res.data;

                            if (!Array.isArray(templates)) {
                                console.error('Unexpected API response format');
                                templates = [];
                            }
                        } catch (error) {
                            console.error('Error fetching gitignore templates:', error);
                            templates = [];
                        }
                    }

                    return templates.filter((template: any) =>
                        !term ||
                        template.toLowerCase().includes(term.toLowerCase())
                    )
                },
            });
        }
        let licenses: any;
        const license: any = await search({
            message: "Choose a license for your repository:",
            source: async (term: string | undefined, { signal }: { signal: AbortSignal }) => {
                if (!licenses) {
                    try {
                        let res = await fetch("https://api.github.com/licenses");
                        licenses = await res.json();

                        if (!Array.isArray(licenses)) {
                            console.error('Unexpected API response format');
                            licenses = [];
                        }
                    } catch (error) {
                        console.error('Error fetching licenses:', error);
                        licenses = [];
                    }
                }

                return licenses
                    .filter((license: any) =>
                        !term ||
                        license.name.toLowerCase().includes(term.toLowerCase()) ||
                        license.key.toLowerCase().includes(term.toLowerCase())
                    )
                    .map((license: any) => ({
                        name: license.name,
                        value: license.key,
                        label: license.name
                    }));
            },
        });
        const projectName = await input({
            message: "What is your project name?",
            default: process.cwd().split("/").pop(),
        });
        const description = await input({
            message: "Brief project description:",
            default: "A new awesome project",
        });
        const initialCommit = await confirm({
            message: "Create initial commit?",
            default: true,
        });

        if (fs.existsSync(path.join(__dirname, ".git"))) {
            console.log(chalk.blue("Initializing git repository..."));
            execSync("git init");
        }

        console.log(chalk.blue("Adding remote repository..."));
        execSync(`git remote add ${remoteName} ${remoteUrl}`);

        console.log(chalk.blue(`Setting up ${branchName} branch...`));
        execSync(`git switch -c ${branchName}`);

        if (addGitignore) {
            await createGitignore(gitignoreTemplate);
        }

        if (license !== "None") {
            await createLicense(license);
        }

        if (projectName && description) {
            createReadme(projectName, description, license);
        }

        if (initialCommit) {
            console.log(chalk.blue("Creating initial commit..."));
            execSync("git add .");
            execSync('git commit -m "Initial commit"');
        }

        console.log(chalk.green("✨ Git repository setup completed!"));
        console.log(chalk.yellow("\nNext steps:"));
        console.log("1. Add your files: git add .");
        console.log(
            '2. Make your first commit: git commit -m "Initial commit"'
        );
        console.log(
            `3. Push to remote: git push -u ${remoteName} ${branchName}`
        );
    } catch (error) {
        console.error(chalk.red("Error setting up repository:"), error);
        process.exit(1);
    }
}

async function createGitignore(template: string) {
    try {
        const response = await axios.get(
            `https://raw.githubusercontent.com/github/gitignore/main/${template}.gitignore`,
        );
        fs.writeFileSync(".gitignore", response.data);
        console.log(chalk.green("✨ Created .gitignore file"));
    } catch (error) {
        console.error(
            chalk.yellow("Warning: Could not create .gitignore file"),
            error
        );
    }
}

async function createLicense(license: string) {
    if (license === "None") return;

    try {
        const response = await axios.get(
            `https://api.github.com/licenses/${license}`
        );
        fs.writeFileSync("LICENSE", response.data.body);
        console.log(chalk.green("✨ Created LICENSE file"));
    } catch (error) {
        console.error(
            chalk.yellow("Warning: Could not create LICENSE file"),
            error
        );
    }
}

function createReadme(
    projectName: string,
    description: string,
    license: string
) {
    const readme = `# ${projectName}

${description}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## License

This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.
`;

    fs.writeFileSync("README.md", readme);
    console.log(chalk.green("✨ Created README.md file"));
}

const pjson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

program
    .version(pjson.version)
    .description(pjson.description)
    .option("-h --help", "Show documentation")
    .option("-d --documentation", "Show documentation")
    .option("-m --manual", "Manual Setup");

program.parse();

if (program.opts().help || program.opts().documentation) {
    console.log(shortDocs);
} else if (program.opts().manual) {
    manualSetup();
} else {
    expressSetup();
}
