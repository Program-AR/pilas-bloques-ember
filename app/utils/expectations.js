import { allProcedureNames, entryPointType } from './blocks'

// GLOBAL EXPECTATIONS
export const declaresAnyProcedure = (/* workspace */) => join([
  `expectation "Declara algún procedimiento": declares something unlike ${toEDLString(entryPointType)};`,
  notTooLong()(entryPointType)
])
export const allProceduresShould = (...expectations) => (workspace) =>
  join(allProcedureNames(workspace).map(multiExpect(...expectations)))

export const multiExpect = (...expectations) => (element) =>
  join(expectations.map(e => e(element)))

// DECLARATION EXPECTATIONS
export const doSomething = (declaration) =>
  `expectation "'${declaration}' hace algo": within ${toEDLString(declaration)} count(calls) >= 1;`

export const isUsed = (declaration) =>
  `expectation "'${declaration}' se usa en algún lado": calls ${toEDLString(declaration)};`

export const isUsedFromMain = (declaration) =>
  `expectation "'${declaration}' se usa desde el programa principal": through ${toEDLString(entryPointType)} calls ${toEDLString(declaration)};`

export const notTooLong = (limit = 7) => (declaration) =>
  `expectation "'${declaration}' hace pocas cosas": within ${toEDLString(declaration)} count(calls) <= ${limit};`


// UTILS
const toEDLString = name => `\`${name}\``

const join = expectations => expectations.join('\n')

