//utils.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

export function generateSizes(from, to, step, special = []) {
    const sizes = [];
    for (let size = from; size <= to; size += step) {
        sizes.push(size);
    }
    sizes.push(to);
    const sortedSizes = [...new Set(sizes.concat(special))].sort((a, b) => a - b);
    return sortedSizes;
}

export function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

export function checkImageExists(imgPath) {
    return !fs.existsSync(imgPath);
}