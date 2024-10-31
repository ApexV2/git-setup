# Git Setup CLI

A simple command-line tool that helps you quickly set up new Git repositories with an interactive prompt. This tool streamlines the process of initializing Git repositories and configuring remotes through an easy-to-use interface.

## Features
- 🚀 Interactive command-line interface
- 📁 Initializes new Git repository
- 🔗 Configures remote repository
- 🌿 Sets up main branch
- 💡 Provides helpful next steps

## Installation

Download the latest `git-setup.exe` from the [releases page](https://github.com/ApexV2/git-setup/releases).

## Usage

The tool provides two main commands:

```bash
# Start the setup process
git-setup -s

# View documentation
git-setup -d
```

When running the setup process, you'll be prompted for:
- Remote name (defaults to "origin")
- Remote repository URL
- Main branch name (defaults to "main")
- Whether to initialize a new repository

## Example

```bash
$ git-setup -s

? What is the remote name? (origin)
? What is the remote repository URL? https://github.com/username/repo.git
? What is your main branch name? (main)
? Initialize a new repository? (Y/n)
```

After completion, the tool will provide next steps for pushing your code.

## Requirements

- Windows OS
- Git installed on your system
- Valid repository URL

## Author

Created with ❤️ by ApexV2

## License

This project is licensed under the MIT License.

