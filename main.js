// main.js
import findConfigFiles from './scripts/findConfigFiles.js';
import handleConfigFile from './scripts/handleConfigFile.js';
import runSharp from './scripts/runSharp.js'

// Main function
async function pugsharp() {
    // Find all config files
    const configPaths = await findConfigFiles();
    // Use the configs to create images and pug files
    for (const configPath of configPaths) {
        // Read, validate and merge the config files
        const config = await handleConfigFile(configPath);
        // Create the images
        await runSharp(config, configPath);

    }
    // All done
    console.log('pugsharp finished.')
    return true
}

export default pugsharp;