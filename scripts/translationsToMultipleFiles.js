const fs = require('fs');
const yaml = require('js-yaml');

// Importing CommonJS sucks, so we'll copy some minor things
const fileMiddleName = '-single-file-from-'
const encoding = 'utf8'
const folderPrefix = 'folder_'
const yamlName = (language) => `${language}.yaml`
const yamlDumpOptions = {
    'flowLevel': -1,
    'lineWidth': -1,
    'noRefs': true
}

function makeMultipleFiles(singleTranslationFileName, translationsFolder='../translations') {
    const translationYaml = loadYaml(singleTranslationFileName)
    yamlDictionariesFrom(translationYaml, translationsFolder, translationLanguage(singleTranslationFileName)).forEach(({ directory, content }) => {
        fs.writeFileSync(directory, yaml.safeDump(content, yamlDumpOptions), encoding)
    })
}

const translationLanguage = (singleTranslationFileName) => singleTranslationFileName.split(fileMiddleName)[0]

function loadYaml(singleTranslationFileName) {
    const fileContents = fs.readFileSync(yamlName(singleTranslationFileName), encoding)
    return yaml.safeLoad(fileContents)
}

function yamlDictionariesFrom(translationYaml, baseDirectory, language) {
    let yamlDictionaries = []
    const singleFileTranslationYaml = {... translationYaml}
    Object.keys(translationYaml)
    .filter(isFolder)
    .forEach(k => {
        yamlDictionaries = yamlDictionaries.concat(
            yamlDictionariesFrom(
                translationYaml[k],
                `${baseDirectory}/${folderName(k)}`,
                language
            )
        )
        delete singleFileTranslationYaml[k]
    })

    const yamlDictionary = yamlDictionaryFrom(singleFileTranslationYaml, baseDirectory, language)

    // Some folders do not have their own translation file.
    if(!isEmpty(yamlDictionary.content)) yamlDictionaries.push(yamlDictionary)

    return yamlDictionaries
}

function isEmpty(obj) { 
    for (var x in obj) { return false; }
    return true;
 }

const isFolder = (key) => key.startsWith(folderPrefix)

const folderName = (folderKey) => folderKey.replace(folderPrefix, '')

function yamlDictionaryFrom(singleFileTranslationYaml, baseDirectory, language) {
    return {
        directory: `${baseDirectory}/${language}.yaml`,
        content: singleFileTranslationYaml
    }
}

console.log('Generating multiple translations files from a single file.')
if(!process.argv[2]) throw Error('Single translations file must be defined. Example: pt-single-file-from-es-ar')
makeMultipleFiles(process.argv[2], process.argv[3])
console.log('Translations files successfully generated!')