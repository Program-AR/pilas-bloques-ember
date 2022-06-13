import { allProcedureNames, entryPointType } from './blocks'

// GLOBAL EXPECTATIONS
export const declaresAnyProcedure = (/* workspace */) =>
  newExpectation(`declares something unlike ${toEDLString(entryPointType)}`, declaresProcedureId, { declaration: entryPointType })

export const allProceduresShould = (...expectations) => (workspace) =>
  join(allProcedureNames(workspace).map(multiExpect(...expectations)))

export const multiExpect = (...expectations) => (element) =>
  join(expectations.map(e => e(element)))

export const usesConditionalAlternative = () =>
  newGlobalExpectation('uses if', conditionalAlternativeId)

export const usesConditionalRepetition = () =>
  newGlobalExpectation('uses while', conditionalRepetitionId)

export const usesSimpleRepetition = () =>
  newGlobalExpectation('uses repeat', simpleRepetitionId)

// DECLARATION EXPECTATIONS
export const doSomething = (declaration) =>
  newExpectation(`${countCallsWithin(declaration)} >= 1`, doSomethingId, { declaration })

export const isUsed = (declaration) =>
  newExpectation(`calls ${toEDLString(declaration)}`, isUsedId, { declaration })

export const isUsedFromMain = (declaration) =>
  newExpectation(`through ${toEDLString(entryPointType)} calls ${toEDLString(declaration)}`, isUsedFromMainId, { declaration })

const declarationNotTooLong = (limit, declaration, expectationName) =>
  newExpectation(`${countCallsWithin(declaration)} <= ${limit - 1}`, expectationName, { declaration, limit })

export const notTooLong = (limit = 7) => (declaration) =>
  declarationNotTooLong(limit, declaration, tooLongId)

export const mainNotTooLong = (limit = 7) =>
  declarationNotTooLong(limit, entryPointType, "main_too_long")

export const noExpectation = (declaration) => '' // jshint ignore: line

export const doesNotUseRecursion = (declaration) =>
  newExpectation(`not (through ${toEDLString(declaration)} calls ${toEDLString(declaration)})`, doesNotUseRecursionId, { declaration })

export const nameWasChanged = (intl) => (declaration) =>
  newSimpleCondition(!declaration.includes(intl.t('blocks.procedures.name').string), nameWasChangedId, { declaration })

// UTILS
const newGlobalExpectation = (expect, id) =>
  newExpectation(`through ${toEDLString(entryPointType)} ${expect}`, id, { declaration: entryPointType })

export const newExpectation = (expect, id, opts = {}) =>
  `expectation "${stringify(id, opts)}": ${expect};`

// Use this to count number of calls inside a procedure, including recursive calls
// Mulang count does not count recursive calls
export const countCallsWithin = (declaration) =>
  `within ${toEDLString(declaration)} count(calls) + count(calls ${toEDLString(declaration)})`

export const stringify = (id, opts) =>
  `${id}|${Object.entries(opts).map(([key, value]) => `${key}=${value}`).join(';')}`

const newSimpleCondition = (condition, id, opt = {}) =>
  newExpectation(condition ? pass : fail, id, opt)

const pass = `calls || ! calls`
const fail = `calls && ! calls`

export const parseExpect = (name) => [
  name.split('|')[0],
  Object.fromEntries(name.split('|')[1].split(';').map(entry => entry.split('=')))
]

export const expectationDescription = (intl, name, result, expectationParams) => {
  const descriptionParams = { result, ...expectationParams }
  const translateAs = (prefix) => {
    const tag = `components.spects.${prefix}.${name}`
    return intl.exists(tag) ? intl.t(tag, descriptionParams).toString() : ''
  }

  return {
    asScoring: translateAs('scoreable'),
    asSuggestion: translateAs('suggestion'),
    forControlGroup: translateAs('control_group')
  }

}

const toEDLString = name => `\`${name}\``

const join = expectations => expectations.join('\n')

export const doesNotUseRecursionId = 'does_not_use_recursion'
export const isUsedId = 'is_used'
const isUsedFromMainId = 'is_used_from_main'

const doSomethingId = 'do_something'
const tooLongId = 'too_long'
const nameWasChangedId = 'name_was_changed'
const conditionalAlternativeId = 'uses_conditional_alternative'
const conditionalRepetitionId = 'uses_conditional_repetition'
const simpleRepetitionId = 'uses_simple_repetition'
const declaresProcedureId = 'declares_procedure'

const criticalExpectationsIds = [doesNotUseRecursionId]

const combinableExclusiveIds = [isUsedId, isUsedFromMainId]

const isPresent = (expectationResult, ids) =>
  ids.some(id => id === expectationResult.id)

export const isCombinableExclusive = (expectationResult) =>
  isPresent(expectationResult, combinableExclusiveIds)

export const isCritical = (expectationResult) =>
  isPresent(expectationResult, criticalExpectationsIds)

export const notCritical = (expectationResult) =>
  !isCritical(expectationResult)

