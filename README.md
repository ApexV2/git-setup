# Git Setup CLI

A simple command-line tool that helps you quickly set up new Git repositories with an interactive prompt.

## Features

- Interactive command-line interface
- Initializes new Git repository
- Configures remote repository
- Sets up main branch
- Provides helpful next steps

## Installation

You can install this package globally using npm:

```bash
npm install -g git-setup-cli
```

Or run it directly using npx:

```bash
npx git-setup-cli
```

## Usage

1. Open your terminal
2. Navigate to your project directory
3. Run the command:

```bash
git-setup
```

The tool will prompt you for:
- Remote name (defaults to "origin")
- Remote repository URL
- Main branch name (defaults to "main")
- Whether to initialize a new repository

## Example

```bash
$ git-setup

? What is the remote name? (origin)
? What is the remote repository URL? https://github.com/username/repo.git
? What is your main branch name? (main)
? Initialize a new repository? (Y/n)
```

After completion, the tool will provide next steps for pushing your code.

## Requirements

- Node.js (version 12 or higher)
- npm (comes with Node.js)
- Git installed on your system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Created with ❤️ by ApexV2

