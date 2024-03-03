// TODO: check
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateBase64Placeholder() {
    try {
        const buffer = await sharp({
            create: {
                width: 1,
                height: 1,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
        .webp({ quality: 1 }) // Maximum compression
        .toBuffer();

        return `data:image/webp;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error('Error generating base64 placeholder:', error);
        return '';
    }
}

async function generateWebpPlaceholder(inputPath, outputPath, size) {
    try {
        await sharp(inputPath)
            .resize(size, size) // Resize to the specified size
            .webp({ quality: 1 }) // Maximum compression
            .toFile(outputPath);
        console.log(`Placeholder generated: ${outputPath}`);
    } catch (error) {
        console.error('Error generating webp placeholder:', error);
    }
}

async function generatePlaceholders(configs, configPath) {
    const basePath = path.dirname(configPath);
    let placeholderDetails = [];

    for (const config of configs) {
        let base64 = '';
        let imgPath = '';
        let placeholderSize = config.placeholder || 1; // Default to 1 if not specified

        if (placeholderSize > 0) {
            base64 = await generateBase64Placeholder();
            const inputPath = path.join(basePath, config.img);
            const outputDir = path.join(basePath, path.basename(config.img, path.extname(config.img)));
            ensureDirectoryExists(outputDir);

            if (placeholderSize > 1) {
                // Generate a specific sized placeholder image
                const outputPath = path.join(outputDir, `placeholder-${placeholderSize}.webp`);
                if (!checkImageExists(outputPath)) {
                    await generateWebpPlaceholder(inputPath, outputPath, placeholderSize);
                }
                imgPath = outputPath; // Update imgPath with the generated placeholder image path
            }
        }

        placeholderDetails.push({ base64, imgPath, placeholderSize });
    }

    console.log('Placeholder generation completed.');
    return placeholderDetails;
}

// Helper functions reused from the provided script
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function checkImageExists(outputPath) {
    return !fs.existsSync(outputPath);
}

export default generatePlaceholders;
