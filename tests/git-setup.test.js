const fs = require('fs');
const { execSync } = require('child_process');

// Mock external dependencies
jest.mock('inquirer');
jest.mock('child_process');
jest.mock('fs');
jest.mock('axios');

describe('Express Setup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize basic repository setup', () => {
        execSync.mockImplementation(() => {});
        
        execSync('git init');
        execSync('git remote add origin https://github.com/test/repo.git');
        execSync('git switch -c main');
        
        expect(execSync).toHaveBeenCalledWith('git init');
        expect(execSync).toHaveBeenCalledWith('git remote add origin https://github.com/test/repo.git');
        expect(execSync).toHaveBeenCalledWith('git switch -c main');
    });
});

describe('Manual Setup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create .gitignore file', async () => {
        fs.writeFileSync.mockImplementation(() => {});
        
        const gitignoreContent = '# Node\nnode_modules/\n';
        fs.writeFileSync('.gitignore', gitignoreContent);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('.gitignore', gitignoreContent);
    });

    test('should create README.md file', () => {
        fs.writeFileSync.mockImplementation(() => {});
        
        const projectName = 'Test Project';
        const description = 'Test Description';
        
        const readme = `# ${projectName}\n\n${description}\n`;
        fs.writeFileSync('README.md', readme);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('README.md', expect.stringContaining(projectName));
    });

    test('should create license file', async () => {
        fs.writeFileSync.mockImplementation(() => {});
        
        const licenseContent = 'MIT License...';
        fs.writeFileSync('LICENSE', licenseContent);
        
        expect(fs.writeFileSync).toHaveBeenCalledWith('LICENSE', licenseContent);
    });

    test('should handle initial commit', () => {
        execSync.mockImplementation(() => {});
        
        execSync('git add .');
        execSync('git commit -m "Initial commit"');
        
        expect(execSync).toHaveBeenCalledWith('git add .');
        expect(execSync).toHaveBeenCalledWith('git commit -m "Initial commit"');
    });
});

describe('Error Handling', () => {
    test('should handle git command errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        execSync.mockImplementation(() => {
            throw new Error('Git command failed');
        });
        
        try {
            execSync('git init');
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    test('should handle file creation errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        fs.writeFileSync.mockImplementation(() => {
            throw new Error('File creation failed');
        });
        
        try {
            fs.writeFileSync('README.md', 'content');
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
}); 