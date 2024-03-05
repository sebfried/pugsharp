import fs from 'fs/promises';
import path from 'path';
import * as utils from './utils.js';

const mixinName = "img";

async function generateMixinContent(config, template) {
  const { format, from, to, step, special, "data-src": dataSrcSwitch  } = config;
  const sizes = utils.generateSizes(from, to, step, special);

  const sizesAndFormats = format.map(fmt => ({
    sizes: sizes,
    format: fmt
  }));

  const sizesAndFormatsString = JSON.stringify(sizesAndFormats).replace(/"/g, '\'');

  let populatedTemplate = template
    .replace('${sizesAndFormats}', `${sizesAndFormatsString}`)
    .replace('${dataSrcSwitch}', `${dataSrcSwitch}`);

  return populatedTemplate;
}

async function saveMixin(mixinContent, config, configPath) {
  const imgName = path.basename(config.img, path.extname(config.img));
  const outputPath = path.join(path.dirname(configPath), `${imgName}/${imgName}.pug`);

  await fs.writeFile(outputPath, mixinContent);
  console.log(`Mixin generated: ${outputPath}`);
}

async function createPug(config, configPath) {
  const templatePath = path.resolve(utils.dirname, '..', 'templates', 'mixin.pug');
  const mixinTemplate = await fs.readFile(templatePath, 'utf8');

  for (const imgConfig of config) {
    const mixinContent = await generateMixinContent(imgConfig, mixinTemplate);
    await saveMixin(mixinContent, imgConfig, configPath)
  }

  console.log(`All Pug mixins of ${configPath} have been created.`);
}

export default createPug;