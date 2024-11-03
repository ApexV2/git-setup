import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import globals from 'globals';

export default tslint.config(eslint.configs.recommended, ...tslint.configs.recommended, {
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    },
});
