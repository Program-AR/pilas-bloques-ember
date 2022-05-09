const fs = require('fs');
const yaml = require('js-yaml');

// Importing CommonJS sucks, so we'll copy some minor things
const encoding = 'utf8'
const folderPrefix = 'folder_'
const yamlName = (language) => `${language}.yaml`
const yamlDumpOptions = {
    'flowLevel': -1,
    'lineWidth': -1,
    'noRefs': true
}

checkExistence(2, 'single translations file name')
checkExistence(3, 'translation language')
console.log('Generating multiple translations files from a single file.')
makeMultipleFiles(process.argv[2], process.argv[3])
console.log('Translations files successfully generated!')

function checkExistence(argPosition, missingArgDescription) {
    if(!process.argv[argPosition]) {
        console.info(
            `
            SCRIPT INFO:
            First arg: Single translations file name. Does not need to have a specific name. E.g.: 'pt-single-file-from-es-ar'.
            Second arg: Translation language. E.g.: 'pt' (portuguese).
            Third arg (Optional, base value: '../translations'): Translations source directory. Folder where we can find all translations. E.g.: '../translations'
            Use example: node translationsToMultipleFiles.js 'pt-single-file-from-es-ar' 'pt' '../translations'
            If you want to separate a single file with portuguese translations
            into multiple files inside ../translations directory
            `
        )
        throw Error(`Missing ${missingArgDescription}. Please read info.`)
    }
}

function makeMultipleFiles(singleTranslationFileName, translationLanguage, translationsFolder='../translations') {
    const translationYaml = loadYaml(singleTranslationFileName)
    yamlDictionariesFrom(translationYaml, translationsFolder, translationLanguage).forEach(({ directory, content }) => {
        fs.writeFileSync(directory, yaml.dump(content, yamlDumpOptions), encoding)
    })
}

function loadYaml(singleTranslationFileName) {
    const fileContents = fs.readFileSync(yamlName(singleTranslationFileName), encoding)
    return yaml.load(fileContents)
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

function isEmpty(obj) { return Object.keys(obj).length === 0 }

function isFolder(key) { return key.startsWith(folderPrefix) }

function folderName(folderKey) { return folderKey.replace(folderPrefix, '') } 

function yamlDictionaryFrom(singleFileTranslationYaml, baseDirectory, language) {
    return {
        directory: `${baseDirectory}/${language}.yaml`,
        content: singleFileTranslationYaml
    }
}