// runSharp.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function generateSizes(from, to, step, special = []) {
    const sizes = [];
    for (let size = from; size <= to; size += step) {
        sizes.push(size);
    }
    sizes.push(to);
    return [...new Set(sizes.concat(special))];
}

function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function checkImageExists(outputPath) {
    return !fs.existsSync(outputPath);
}

async function processSizeAndFormat(inputPath, outputPath, size, fmt, formatOptions) {
    let image = sharp(inputPath).resize({ width: size });
    image = image.toFormat(fmt, formatOptions);
    await image.toFile(outputPath);
    console.log(`Created: ${outputPath}`);
}

async function processImageConfig(config, basePath) {
    const { img, format, from, to, step, special } = config;
    const sizes = generateSizes(from, to, step, special);
    const inputPath = path.join(basePath, img);
    const outputDir = path.join(basePath, path.basename(img, path.extname(img)));

    ensureDirectoryExists(outputDir);

    for (let size of sizes) {
        for (let fmt of format) {
            const outputFilename = `${path.basename(img, path.extname(img))}-${size}.${fmt}`;
            const outputPath = path.join(outputDir, outputFilename);
            
            if (checkImageExists(outputPath)) {
                const formatOptions = config[`sharp-${fmt}`] || {};
                await processSizeAndFormat(inputPath, outputPath, size, fmt, formatOptions);
            } else {
                console.log(`Skipping existing image: ${outputPath}`);
            }
        }
    }
}

async function runSharp(configs, configPath) {
    const basePath = path.dirname(configPath);

    for (const config of configs) {
        await processImageConfig(config, basePath);
    }
    console.log(`All images of ${configPath} have been processed.`);
}

export default runSharp;
