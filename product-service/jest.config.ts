import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    moduleDirectories: [
        "node_modules",
        "src"
    ]
};

export default config;