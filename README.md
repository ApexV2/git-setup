# Git Setup CLI

A simple command-line tool that helps you quickly set up new Git repositories with an interactive prompt. This tool streamlines the process of initializing Git repositories and configuring remotes through an easy-to-use interface.

## Features
- 🚀 Interactive command-line interface
- 📁 Initializes new Git repository
- 🔗 Configures remote repository
- 🌿 Sets up main branch
- 📝 Generates README.md template
- 📄 Creates LICENSE file with multiple options
- ⚡ Adds .gitignore with popular templates
- 💡 Provides helpful next steps

## Installation

### Option 1: Download Executable
Download the latest `git-setup.exe` from the [releases page](https://github.com/ApexV2/git-setup/releases).

### Option 2: NPM Installation
You can install globally using npm:
```bash
npm install -g git-setup-cli
```

Or run directly using npx:
```bash
npx git-setup-cli
```

## Usage

The tool provides three main commands:

```bash
# Express setup (basic configuration)
git-setup -e

# Manual setup (full configuration)
git-setup -m

# View documentation
git-setup -d
```

### Express Setup (-e)
Quick setup with basic configurations:
- Remote name (defaults to "origin")
- Remote repository URL
- Main branch name (defaults to "main")
- Initialize repository option

### Manual Setup (-m)
Complete setup with all configuration options:
- Remote name (defaults to "origin")
- Remote repository URL
- Main branch name (defaults to "main")
- Initialize repository option
- .gitignore template selection
- License type selection
- Project name and description
- Initial commit option

### Supported .gitignore Templates
- Node.js
- Python
- Java
- Ruby
- Go
- Visual Studio Code
- JetBrains
- macOS
- Windows

### Available Licenses
- MIT
- Apache-2.0
- GPL-3.0
- BSD-3-Clause

## Example

```bash
$ git-setup -s

? What is the remote name? (origin)
? What is the remote repository URL? https://github.com/username/repo.git
? What is your main branch name? (main)
? Initialize a new repository? (Y/n)
? Would you like to add a .gitignore file? (Y/n)
? Choose a .gitignore template: Node.js
? Choose a license for your repository: MIT
? What is your project name? my-awesome-project
? Brief project description: An awesome new project
? Create initial commit? (Y/n)
```

## Development

### Requirements
- Node.js (v16 or higher)
- Git installed on your system
- npm or yarn package manager

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/ApexV2/git-setup.git

# Install dependencies
npm install

# Run tests
npm test
```

### Testing
The project uses Jest for testing. Test files are located in the `tests/` directory.

To run tests:
```bash
npm test
```

To run tests with coverage:
```bash
npm test -- --coverage
```

### Building
To build the executable:
```bash
npm run build
```
This will create a standalone executable in the `dist/` directory.

## CI/CD

The project uses GitHub Actions for continuous integration. On each push and pull request to the main branch, it:
- Runs the test suite
- Checks code coverage
- Validates the build process

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Created with ❤️ by ApexV2

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

