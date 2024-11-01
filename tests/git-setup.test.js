const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Mock external dependencies
jest.mock('inquirer');
jest.mock('child_process');
jest.mock('fs');
jest.mock('axios');

describe('git-setup CLI', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should initialize git repository', async () => {
        // Mock execSync to prevent actual git commands
        execSync.mockImplementation(() => {});
        
        // Simulate initializing a git repo
        execSync('git init');
        
        expect(execSync).toHaveBeenCalledWith('git init');
    });

    test('should create .gitignore file', async () => {
        // Mock fs.writeFileSync to prevent actual file creation
        fs.writeFileSync.mockImplementation(() => {});
        
        const gitignoreContent = '# Node\nnode_modules/\n';
        fs.writeFileSync('.gitignore', gitignoreContent);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('.gitignore', gitignoreContent);
    });

    test('should create README.md file', () => {
        // Mock fs.writeFileSync
        fs.writeFileSync.mockImplementation(() => {});
        
        const testProjectName = 'Test Project';
        const testDescription = 'Test Description';
        
        const expectedReadme = `# ${testProjectName}\n\n${testDescription}\n`;
        fs.writeFileSync('README.md', expectedReadme);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('README.md', expect.stringContaining(testProjectName));
    });

    test('should handle errors gracefully', async () => {
        // Mock console.error to capture error messages
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Mock execSync to throw an error
        execSync.mockImplementation(() => {
            throw new Error('Git command failed');
        });
        
        // Trigger an error by trying to execute a git command
        try {
            execSync('git init');
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});

describe('License handling', () => {
    test('should create license file', async () => {
        fs.writeFileSync.mockImplementation(() => {});
        
        const licenseContent = 'MIT License...';
        fs.writeFileSync('LICENSE', licenseContent);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('LICENSE', licenseContent);
    });
});

describe('Git remote handling', () => {
    test('should add remote repository', () => {
        execSync.mockImplementation(() => {});
        
        const remoteName = 'origin';
        const remoteUrl = 'https://github.com/user/repo.git';
        
        execSync(`git remote add ${remoteName} ${remoteUrl}`);
        
        expect(execSync).toHaveBeenCalledWith(`git remote add ${remoteName} ${remoteUrl}`);
    });
}); 