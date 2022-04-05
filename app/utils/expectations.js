import { allProcedureNames, entryPointType } from './blocks'

// GLOBAL EXPECTATIONS
export const declaresAnyProcedure = (/* workspace */) =>
  newExpectation(`declares something unlike ${toEDLString(entryPointType)}`, 'declares_procedure', { declaration: entryPointType })

export const allProceduresShould = (...expectations) => (workspace) =>
  join(allProcedureNames(workspace).map(multiExpect(...expectations)))

export const multiExpect = (...expectations) => (element) =>
  join(expectations.map(e => e(element)))

// DECLARATION EXPECTATIONS
export const doSomething = (declaration) =>
  newExpectation(`within ${toEDLString(declaration)} count(calls) >= 1`, 'do_something', { declaration })

export const isUsed = (declaration) =>
  newExpectation(`calls ${toEDLString(declaration)}`, 'is_used', { declaration })

export const isUsedFromMain = (declaration) =>
  newExpectation(`through ${toEDLString(entryPointType)} calls ${toEDLString(declaration)}`, 'is_used_from_main', { declaration })

export const notTooLong = (limit = 7) => (declaration) =>
  newExpectation(`within ${toEDLString(declaration)} count(calls) <= ${limit - 1}`, 'too_long', { declaration, limit })

export const doesNotUseRecursion = (declaration) =>
  newExpectation(`within ${toEDLString(declaration)} ! calls ${toEDLString(declaration)}`, 'does_not_use_recursion', { declaration })

// UTILS
const newExpectation = (expect, id, opts = {}) =>
  `expectation "${stringify(id, opts)}": ${expect};`

const stringify = (id, opts) => // TODO: test
  `model.spects.${id}|${Object.entries(opts).map(([key, value]) => `${key}=${value}`).join(';')}`

export const parseExpect = (name) => [
  name.split('|')[0],
  Object.fromEntries(name.split('|')[1].split(';').map(entry => entry.split('=')))
]

const toEDLString = name => `\`${name}\``

const join = expectations => expectations.join('\n')

