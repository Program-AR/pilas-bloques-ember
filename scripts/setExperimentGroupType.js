#!/usr/bin/node

/**
 * This script is meant to be used from root directory.
 */

const fs = require('fs')

const defaultExperimentGroupType = 'notAffected'
const groupTypeKey = 'EXPERIMENT_GROUP_TYPE'
const dotenvPath = '.env' // Warning: this will fail if used from somewhere else
const encoding = 'utf8'
const dotenvExperimentGroupDoc = '# Possible values: treatment, control or notAffected'
const experimentGroupTypes = ['treatment', 'control', defaultExperimentGroupType]

setExperimentGroupType(process.argv[2])

function setExperimentGroupType(experimentGroupType) {

    let lines

    try {
        const data = fs.readFileSync(dotenvPath, encoding)
        lines = splitLines(data.toString())
    }
    catch {
        // File does not exist
        lines = []
    }

    const savedExperimentGroupIndex = lines.findIndex(l => l.startsWith(groupTypeKey))

    if(savedExperimentGroupIndex < 0) {
        lines.push(documentedExperimentLine(experimentGroupType))
    }
    else {
        const [, currentGroup] = lines[savedExperimentGroupIndex].split('=')
        lines[savedExperimentGroupIndex] = experimentGroupTypeLine(experimentGroupType, currentGroup)
    }

    fs.writeFileSync(dotenvPath, joinLines(lines))
}

function splitLines(lines) {
    return lines.split('\n')
}

function joinLines(lines) {
    return lines.join('\n')
}

/**
 * This enables to start or build the app without specifying an experiment group type
 */
function selectedExperimentGroupType(experimentGroupType) {
    return experimentGroupTypes.includes(experimentGroupType) ? experimentGroupType : undefined
}

function experimentGroupTypeLine(experimentGroupType, currentGroup = false) {
    return `${groupTypeKey}=${selectedExperimentGroupType(experimentGroupType) || currentGroup || defaultExperimentGroupType}`
}

function documentedExperimentLine(experimentGroupType) {
    return `\n${dotenvExperimentGroupDoc}\n${experimentGroupTypeLine(experimentGroupType)}`
}