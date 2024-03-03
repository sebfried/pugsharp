// handleConfigFile.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import lodash from 'lodash';
// const { merge } = lodash;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultConfigFilePath = path.join(__dirname, '../presets', 'pugsharp.json');

function readConfigFile(configFilePath) {
    try {
        const configFileContent = fs.readFileSync(configFilePath, 'utf8');
        return JSON.parse(configFileContent);
    } catch (error) {
        console.error(`Error reading or parsing the configuration file ${configFilePath}: ${error}`);
        return {};
    }
}

function mergeConfigs(defaultConfig, userConfig) {
    try {
        // TODO: Merge logic
        const mergedConfig = merge({}, defaultConfig, userConfig);
        return mergedConfig;
    } catch (error) {
        console.error(`Merge error: ${error}`);
        return {};
    }
}

function validateConfig(config) {
    try {
        const validatedConfig = config;
        // TODO: Validate config
        return validatedConfig;
    } catch (error) {
        console.error(`Validation error: ${error}`);
        return {};
    }
}

function handleConfigFile(userConfigFilePath) {
    const userConfig = readConfigFile(userConfigFilePath);
    const defaultConfig = readConfigFile(defaultConfigFilePath);

    const validUserConfig = validateConfig(userConfig);
    const validDefaultConfig = validateConfig(defaultConfig);

    // const mergedConfig = mergeConfigs(validDefaultConfig, validUserConfig);
    const mergedConfig = validUserConfig;

    console.log('Config ready: ' + userConfigFilePath);
    return mergedConfig;
}

export default handleConfigFile