import fs from 'fs/promises';
import path from 'path';
import * as utils from './utils.js';

const mixinName = "img";

async function generateMixinContent(config, template) {
  const { format, from, to, step, special, "data-src": dataSrcSwitch, lazy  } = config;
  const specialSizesArray = utils.ensureArray(special);
  const sizes = utils.generateSizes(from, to, step, specialSizesArray);
  const formatArray = utils.ensureArray(format);

  const sizesAndFormats = formatArray.map(fmt => ({
    sizes: sizes,
    format: fmt
  }));

  const sizesAndFormatsString = JSON.stringify(sizesAndFormats).replace(/"/g, '\'');

  const loadingLazy = lazy ?? true;

  let populatedTemplate = template
    .replace('${sizesAndFormats}', `${sizesAndFormatsString}`)
    .replace('${dataSrcSwitch}', `${dataSrcSwitch}`)
    .replace('${loadingLazy}', `${loadingLazy}`);

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