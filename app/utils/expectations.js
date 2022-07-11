import { allProcedureNames, allBlocksNestingControlStructures, entryPointType } from './blocks'

// GLOBAL EXPECTATIONS
export const declaresAnyProcedure = (/* workspace */) =>
  newExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    `declares something unlike ${toEDLString(entryPointType)}`, declaresProcedureId, { declaration: entryPointType })

export const allProceduresShould = (...expectations) => (workspace) =>
  allShould(allProcedureNames(workspace), ...expectations)

export const allControlStructuresShould = (...expectations) => (workspace) =>
  allShould(allBlocksNestingControlStructures(workspace), ...expectations)

export const usesConditionalAlternative = () =>
  newGlobalExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    'uses if', conditionalAlternativeId)

export const usesConditionalRepetition = () =>
  newGlobalExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    'uses while', conditionalRepetitionId)

export const usesSimpleRepetition = () =>
  newGlobalExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    'uses repeat', simpleRepetitionId)

// DECLARATION EXPECTATIONS
export const doSomething = (declaration) =>
  newExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    `${countCallsWithin(declaration)} >= 1`, doSomethingId, { declaration })

export const doesNotNestControlStructures = (declaration) => 
  newExpectation(
    {isSuggestion: true, isForControlGroup: true, isScoreable: true, warningInControlStructureBlock: true},
    `within ${toEDLString(declaration)} ${nestedAlternativeStructureEDL} && ${nestedControlStructureEDL('repeat')} && ${nestedControlStructureEDL('while')}`, doesNotNestControlStructuresId, { declaration })

export const isUsed = (declaration) =>
  newExpectation(
    { isSuggestion: true },
    `calls ${toEDLString(declaration)}`, isUsedId, { declaration })

export const isUsedFromMain = (declaration) =>
  newExpectation(
    { isSuggestion: true },
    `through ${toEDLString(entryPointType)} calls ${toEDLString(declaration)}`, isUsedFromMainId, { declaration })

const declarationNotTooLong = (limit, declaration, expectationName) =>
  newExpectation(
    { isSuggestion: true, isForControlGroup: true, isScoreable: true },
    `${countCallsWithin(declaration)} <= ${limit - 1}`, expectationName, { declaration, limit })

export const notTooLong = (limit = 7) => (declaration) =>
  declarationNotTooLong(limit, declaration, tooLongId)

export const mainNotTooLong = (limit = 7) =>
  declarationNotTooLong(limit, entryPointType, "main_too_long")

export const noExpectation = (declaration) => '' // jshint ignore: line

export const doesNotUseRecursion = (declaration) =>
  newExpectation(
    { isCritical: true, isSuggestion: true },
    `not (through ${toEDLString(declaration)} calls ${toEDLString(declaration)})`, doesNotUseRecursionId, { declaration }
  )

export const nameWasChanged = (intl) => (declaration) =>
  newSimpleCondition(
    { isSuggestion: true, isScoreable: true, isForControlGroup: true },
    !declaration.includes(intl.t('blocks.procedures.name').string), nameWasChangedId, { declaration })

// UTILS
const newGlobalExpectation = (types, expect, id) =>
  newExpectation(types, `through ${toEDLString(entryPointType)} ${expect}`, id, { declaration: entryPointType })

export const newExpectation = (types, expect, id, opts = {}) =>
  `expectation "${stringify(id, { ...types, ...opts })}": ${expect};`

const allShould = (scope, ...expectations) =>
  join(scope.map(multiExpect(...expectations)))

export const multiExpect = (...expectations) => (element) =>
  join(expectations.map(e => e(element)))

// Use this to count number of calls inside a procedure, including recursive calls
// Mulang count does not count recursive calls
export const countCallsWithin = (declaration) =>
  `within ${toEDLString(declaration)} count(calls) + count(calls ${toEDLString(declaration)})`

export const stringify = (id, opts) =>
  `${id}|${Object.entries(opts).map(([key, value]) => `${key}=${value}`).join(';')}`

const newSimpleCondition = (types, condition, id, opt = {}) =>
  newExpectation(types, condition ? pass : fail, id, opt)

const pass = `calls || ! calls`
const fail = `calls && ! calls`

const usesControlStructureEDL = 'something that (uses if || uses while || uses repeat)'
const nestedControlStructureEDL = (loop) => `! uses ${loop} with (anything, ${usesControlStructureEDL})`
const nestedAlternativeStructureEDL =  `! uses if with (anything, ${usesControlStructureEDL}, anything) && ! uses if with (anything, anything, ${usesControlStructureEDL})`

export const parseExpect = (name) => {
  const expectationName = name.split('|')[0]
  const stringToBool = (string) => (string === 'true' || string === 'false') ? string === 'true' : string
  const expectationParams = Object.fromEntries(name.split('|')[1].split(';').map(entry => entry.split('=')).map(([paramName, paramValue]) => [paramName, stringToBool(paramValue)]))
  return [expectationName, expectationParams]

}

export const expectationDescription = (intl, name, result, expectationParams) => {
  const descriptionParams = { result, ...expectationParams }
  const translateAs = (prefix) => {
    const tag = `components.spects.${prefix}.${name}`
    return intl.t(tag, descriptionParams).toString()
  }

  return {
    asScoring: (expectationParams && expectationParams.isScoreable) ? translateAs('scoreable') : '',
    asSuggestion: (expectationParams && expectationParams.isSuggestion) ? translateAs('suggestions') : '',
    forControlGroup: (expectationParams && expectationParams.isForControlGroup) ? translateAs('control_group') : ''
  }

}

const toEDLString = name => `\`${name}\``

const join = expectations => expectations.join('\n')

export const doesNotUseRecursionId = 'does_not_use_recursion'
const isUsedId = 'is_used'
const isUsedFromMainId = 'is_used_from_main'

const doSomethingId = 'do_something'
const tooLongId = 'too_long'
const nameWasChangedId = 'name_was_changed'
const conditionalAlternativeId = 'uses_conditional_alternative'
const conditionalRepetitionId = 'uses_conditional_repetition'
const simpleRepetitionId = 'uses_simple_repetition'
const declaresProcedureId = 'declares_procedure'
const doesNotNestControlStructuresId = 'does_not_nest_control_structures'

export const isCritical = (expectationResult) => expectationResult && expectationResult.isCritical

export const notCritical = (expectationResult) => !isCritical(expectationResult) && !warningInControlStructureBlock(expectationResult)

export const warningInControlStructureBlock = (expectationResult) => expectationResult && expectationResult.warningInControlStructureBlock

