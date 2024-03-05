// runSharp.js
import sharp from 'sharp';
import path from 'path';
import * as utils from './utils.js';

async function processSizeAndFormat(inputPath, outputPath, size, fmt, formatOptions) {
    let image = sharp(inputPath).resize({ width: size });
    image = image.toFormat(fmt, formatOptions);
    await image.toFile(outputPath);
    console.log(`Created: ${outputPath}`);
}

async function processImageConfig(config, basePath) {
    const { img, format, from, to, step, special } = config;
    const specialSizesArray = utils.ensureArray(special);
    const sizes = utils.generateSizes(from, to, step, specialSizesArray);
    const formatArray = utils.ensureArray(format);
    const inputPath = path.join(basePath, img);
    const outputDir = path.join(basePath, path.basename(img, path.extname(img)));

    utils.ensureDirectoryExists(outputDir);

    for (let size of sizes) {
        for (let fmt of formatArray) {
            const outputFilename = `${path.basename(img, path.extname(img))}-${size}.${fmt}`;
            const outputPath = path.join(outputDir, outputFilename);

            if (utils.checkImageExists(outputPath)) {
                const formatOptions = config[`sharp-${fmt}`] || {};
                await processSizeAndFormat(inputPath, outputPath, size, fmt, formatOptions);
            } else {
                console.log(`Skipping existing image: ${outputPath}`);
            }
        }
    }
}

async function runSharp(config, configPath) {
    const basePath = path.dirname(configPath);

    for (const imgConfig of config) {
        await processImageConfig(imgConfig, basePath);
    }
    console.log(`All images of ${configPath} have been created.`);
}

export default runSharp;
