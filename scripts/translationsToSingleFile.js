#!/usr/bin/node

// Use example: node translationsToSingleFile.js 'pt' 'en-us' ../translations
// If you want to make a single file for portuguese translations
// using en-us as base language and ../translations as source directory

const fs = require('fs');
const yaml = require('js-yaml');

/*
 * Example:
 * makeSingleFile('es-ar', 'pt', translationsFolder)
 * 
*/
function makeSingleFile(languageToTranslate, baseLanguage='es-ar', source='../translations') {
    const yamlString = yaml.safeDump(translationsToSingleFile(languageToTranslate, baseLanguage, source))
    fs.writeFileSync(`${languageToTranslate}-single-file-from-${baseLanguage}.yaml`, yamlString, 'utf8');
}

const yamlName = (language) => `${language}.yaml`

const languageFile = (dirents, language) =>
    dirents.find(d => yamlName(language) === d.name)

function yamlFile(source, dirent) {
    const fileContents = fs.readFileSync(`${source}/${dirent.name}`, 'utf8')
    return yaml.safeLoad(fileContents)
}

function mergedYamls(old, _new) {
    const merged = {...old}
    for (var i in old) {
        if(_new[i]) {
            // If value is another dictionary, both should be merged too
            if(old[i].constructor == Object) {
                merged[i] = mergedYamls(old[i], _new[i])
            }
            else {
                merged[i] = _new[i]
            }
        }
    }
    return merged
}

function translationsToSingleFile(languageToTranslate, baseLanguage, source) {
    const dirents = fs.readdirSync(source, { withFileTypes: true })

    let translationYaml = {}

    const baseLanguageFile = languageFile(dirents, baseLanguage)
    
    // Some folders do not have their onw translation file. E.g. templates
    if(baseLanguageFile) {
        const languageToTranslateFile = languageFile(dirents, languageToTranslate)

        translationYaml = yamlFile(source, baseLanguageFile)
    
        if(languageToTranslateFile) {
            translationYaml = mergedYamls(translationYaml, yamlFile(source, languageToTranslateFile))
            if(source === '../translations'){
                console.log(`MERGED TRANSLATIONS: ${JSON.stringify(translationYaml)}`)
            }
        }
    }

    dirents.filter(d => d.isDirectory()).forEach(d => {
        translationYaml[`folder_${d.name}`] = translationsToSingleFile(languageToTranslate, baseLanguage, `${source}/${d.name}`)
    })

    return translationYaml
}

console.log('Generating single translation file...')
if(!process.argv[2]) throw Error('Translation language must be defined. Example: en-us')
makeSingleFile(process.argv[2], process.argv[3], process.argv[4])
console.log('Translation file successfully generated!')