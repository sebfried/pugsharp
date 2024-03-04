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
        if (paths.length === 0) {
            console.log(`\nNo ${configFileName} config file found. \n\n-----\nVisit https://www.npmjs.com/package/pugsharp for sample configs!\n---\n`);
            process.exit(1);
        } else {
            console.log('Found config files:', paths);
        }
        return paths;
    } catch (error) {
        console.error('Error searching for config files:', error);
        return [];
    }
}

export default findConfigFiles;