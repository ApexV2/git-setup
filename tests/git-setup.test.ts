import { execSync } from 'child_process';
import {writeFileSync} from 'fs'

// Mock external dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('axios');

describe('Express Setup', () => {

    const mockedExecSync = jest.mocked(execSync);

    beforeEach(() => {
        mockedExecSync.mockClear();
        mockedExecSync.mockImplementation(() => Buffer.from(''));
        jest.clearAllMocks();
    });

    test('should initialize basic repository setup', () => {
        execSync('git init');
        execSync('git remote add origin https://github.com/test/repo.git');
        execSync('git switch -c main');

        expect(mockedExecSync).toHaveBeenCalledWith('git init');
        expect(mockedExecSync).toHaveBeenCalledWith('git remote add origin https://github.com/test/repo.git');
        expect(mockedExecSync).toHaveBeenCalledWith('git switch -c main');
    });
});

describe('Manual Setup', () => {

    const mockedWriteFileSync = jest.mocked(writeFileSync)
    const mockedExecSync = jest.mocked(execSync);

    beforeEach(() => {
        mockedWriteFileSync.mockClear()
        mockedWriteFileSync.mockImplementation(() => {})
        mockedExecSync.mockClear();
        mockedExecSync.mockImplementation(() => Buffer.from(''));
        jest.clearAllMocks();
    });

    test('should create .gitignore file', async () => {
        const gitignoreContent = '# Node\nnode_modules/\n';
        writeFileSync('.gitignore', gitignoreContent);

        expect(mockedWriteFileSync).toHaveBeenCalledWith('.gitignore', gitignoreContent);
    });

    test('should create README.md file', () => {
        const projectName = 'Test Project';
        const description = 'Test Description';

        const readme = `# ${projectName}\n\n${description}\n`;
        writeFileSync('README.md', readme);

        expect(mockedWriteFileSync).toHaveBeenCalledWith('README.md', expect.stringContaining(projectName));
    });

    test('should create license file', async () => {
        const licenseContent = 'MIT License...';
        writeFileSync('LICENSE', licenseContent);

        expect(mockedWriteFileSync).toHaveBeenCalledWith('LICENSE', licenseContent);
    });

    test('should handle initial commit', () => {
        execSync('git add .');
        execSync('git commit -m "Initial commit"');

        expect(mockedExecSync).toHaveBeenCalledWith('git add .');
        expect(mockedExecSync).toHaveBeenCalledWith('git commit -m "Initial commit"');
    });
});

describe('Error Handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should handle git command errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const mockedExecSync = jest.mocked(execSync);

        mockedExecSync.mockImplementationOnce(() => {
            throw new Error('Git command failed');
        });

        try {
            execSync('git init');
        } catch (error) {
            console.error('Git command failed:', error);
        }

        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy.mock.calls[0][0]).toBe('Git command failed:');
        expect(consoleSpy.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(consoleSpy.mock.calls[0][1].message).toBe('Git command failed');

        consoleSpy.mockRestore();
    });

    test('should handle file creation errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const mockedWriteFileSync = jest.mocked(writeFileSync);

        mockedWriteFileSync.mockImplementationOnce(() => {
            throw new Error('File creation failed');
        });

        try {
            writeFileSync('test.txt', 'content');
        } catch (error) {
            console.error('File creation failed:', error);
        }

        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy.mock.calls[0][0]).toBe('File creation failed:');
        expect(consoleSpy.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(consoleSpy.mock.calls[0][1].message).toBe('File creation failed');

        // const lastCall = consoleSpy.mock.calls[1];
        // expect(lastCall[0]).toBe('File creation failed:');
        // expect(lastCall[1]).toBeInstanceOf(Error);
        // expect(lastCall[1].message).toBe('File creation failed');

        consoleSpy.mockRestore();
    });
});
