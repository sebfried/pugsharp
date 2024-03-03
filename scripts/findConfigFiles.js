// findConfigFiles.js
import fg from 'fast-glob';

const excludedDirectories = ['node_modules/**', '.git/**'];
const configFileName = 'pugsharp.json';
const startPath = '.';
const includeDotfiles = false;

async function findConfigFiles() {
    const pattern = `${startPath}/**/${configFileName}`;
    const options = {
        ignore: excludedDirectories,
        dot: includeDotfiles,
    };

    try {
        const paths = await fg(pattern, options);
        console.log('Found config files:', paths);
        return paths;
    } catch (error) {
        console.error('Error searching for config files:', error);
        return [];
    }
}

export default findConfigFiles;