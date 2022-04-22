#!/usr/bin/node

const fs = require('fs');
const yaml = require('js-yaml');

/*
 * Example:
 * makeSingleFile('es-ar', 'pt', translationsFolder)
 * 
 */
function makeSingleFile(languageToTranslate, baseLanguage='es-ar', source='../translations') {
    const yamlString = translationsToSingleFile(languageToTranslate, baseLanguage, source)
    fs.writeFileSync(`${baseLanguage}-single-file.yaml`, yamlString, 'utf8');
}

function translationsToSingleFile(languageToTranslate, baseLanguage, source) {

}

console.log('Generating single translation file...')
if(!process.argv[2]) throw Error('Translation language must be defined. Example: en-us')
makeSingleFile(process.argv[2], process.argv[3], process.argv[4])
console.log('Translation file successfully generated!')