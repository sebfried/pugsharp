import fs from 'fs/promises';
import path from 'path';
import * as utils from './utils.js';

const mixinName = "img";

async function generateMixinContent(config, template) {
  const { img, format, from, to, step, special } = config;
  const sizes = utils.generateSizes(from, to, step, special);
  const imgName = path.basename(img, path.extname(img));

  let sourceSets = format.map(format =>
    sizes.map(size => `${imgName}-${size}.${format} ${size}w`).join(', ')
  ).join(',\n      ');

  let populatedTemplate = template
    .replace('${mixinName}', mixinName)
    .replace('${formats}', `['${format.join("', '")}']`)
    .replace('${sourceSets}', sourceSets);

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