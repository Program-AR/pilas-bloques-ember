import Service from '@ember/service'
import { getName, getParams, getChild, getBlockSiblings, isOperator, isValue, isProcedure, isProcedureCall } from './block-utils'
import { createNode, createReference, createEmptyNode } from './pilas-ast'

const entryPointType = 'al_empezar_a_ejecutar'

export default Service.extend({

  analyze(workspace, activity) {

    const EDLString = name => `\`${name}\``
    
    // const allPrimitiveNames = activity.bloques.map(EDLString).join(', ')
    const globalExpects = [
      `expectation "Declara algún procedimiento": declares something unlike ${EDLString(entryPointType)};`,
      `expectation "Divide en subtareas": within ${EDLString(entryPointType)} count(calls) < 7;`,
    ]

    const allProcedureNames = workspace.getAllBlocks().filter(isProcedure).map(getName)
    const procedureExpects = allProcedureNames.flatMap(
      procedureName => [
        `expectation "'${procedureName}' hace algo": within ${EDLString(procedureName)} count(calls) >= 1;`,
        `expectation "'${procedureName}' se usa en algún lado": calls ${EDLString(procedureName)};`,
        `expectation "'${procedureName}' se usa desde el programa principal": through ${EDLString(entryPointType)} calls ${EDLString(procedureName)};`,
      ]
    )

    const customExpect = globalExpects.concat(procedureExpects).join('\n')
    const ast = this.parseAll(workspace)
    const mulangAnalysis = mulang.astCode(ast).customExpect(customExpect)
    console.log(mulangAnalysis)


  },

  parseAll(workspace) {
    return createNode("Sequence", workspace.getTopBlocks().map(this.parse))
  },

  parse(mainBlock) {
    return buildBlockAst(mainBlock)
  },

})

function buildBlockAst(block) {
  if (block.isShadow()) return createEmptyNode()
  let { tag, parse } = mulangParser(block)
  return createNode(tag, parse(block))
}

function mulangParser(block) {
  let parser = pilasToMulangParsers[block.type] || searchAlias(block)
  if (parser) return parser
  return isValue(block) ? referenceParser : applicationParser
}

function searchAlias(block) {
  for (const alias of Blockly.aliases(block.type)) {
    if (pilasToMulangParsers[alias]) {
      return pilasToMulangParsers[alias]
    }
  }
}

let entryPointParser = {
  tag: "EntryPoint",
  parse: parseEntryPoint
}

let repeatParser = {
  tag: "Repeat",
  parse: parseRepeat
}

let ifParser = {
  tag: "If",
  parse: parseIf
}

let whileParser = {
  tag: "While",
  parse: parseWhile
}

let numberParser = {
  tag: "MuNumber",
  parse: parseMuNumber
}

let procedureParser = {
  tag: "Procedure",
  parse: parseProcedure
}

let referenceParser = {
  tag: "Reference",
  parse: parseReference
}

let applicationParser = {
  tag: "Application",
  parse: parseApplication
}


let pilasToMulangParsers = {
  [entryPointType]: entryPointParser,
  "repetir": repeatParser,
  "Si": ifParser,
  "SiNo": { ...ifParser, parse: parseIfElse },
  "Hasta": whileParser,
  "math_number": numberParser,
  "Numero": numberParser,
  "procedures_defnoreturn": procedureParser,
  "variables_get": { ...referenceParser, parse: parseVariable }
}

function buildSequenceAst(firstBlock) {
  if (!firstBlock || firstBlock.isShadow()) return createEmptyNode()
  let siblings = getBlockSiblings(firstBlock).filter(block => !block.isShadow())
  if (siblings.length) {
    return createNode("Sequence", [firstBlock, ...siblings].map(b => buildBlockAst(b)))
  } else {
    return buildBlockAst(firstBlock)
  }
}

function parseMuNumber(block) {
  return parseFloat(block.getFieldValue("NUM"))
}

function parseEntryPoint(block) {
  return [
    block.type,
    buildSequenceAst(getChild(block))
  ]
}

function referenceName(block) {
  return isProcedureCall(block) ? block.getFieldValue('NAME')
    : isOperator(block) ? block.getFieldValue('OP')
      : block.type
}

function parseApplication(block) {
  return [
    createReference(referenceName(block)),
    parseArguments(block)
  ]
}

function parseReference(block) {
  return referenceName(block)
}

function parseVariable(block) {
  return block.getFieldValue("VAR")
}

function parseArguments(block) {
  return block.inputList
    .filter(input => input.type == Blockly.INPUT_VALUE)
    .map(input => input.connection.targetBlock())
    .map(b => buildBlockAst(b))
    .concat(...parseText(block))
}

function parseText(block) {
  let text = block.getFieldValue("texto") // TODO: Mega-hard-coded?
  if (!text) return []
  return [createNode("MuString", text)]
}

function parseRepeat(block) {
  let countBlock = block.getInputTargetBlock("count")
  let statements = block.getInputTargetBlock("block")
  return [
    buildBlockAst(countBlock),
    buildSequenceAst(statements)
  ]
}

function parseWhile(block) {
  let condition = block.getInputTargetBlock("condition")
  let statements = block.getInputTargetBlock("block")
  return [
    buildBlockAst(condition),
    buildSequenceAst(statements)
  ]
}

function parseIf(block) {
  let condition = block.getInputTargetBlock("condition")
  let statements = block.getInputTargetBlock("block")
  return [
    buildBlockAst(condition),
    buildSequenceAst(statements),
    createEmptyNode()
  ]
}

function parseIfElse(block) {
  let condition = block.getInputTargetBlock("condition")
  let statementsIf = block.getInputTargetBlock("block1")
  let statementsElse = block.getInputTargetBlock("block2")
  return [
    buildBlockAst(condition),
    buildSequenceAst(statementsIf),
    buildSequenceAst(statementsElse)
  ]
}

function parseProcedure(block) {
  return [
    getName(block),
    createNode("Equation", parseEquation(block))
  ]
}

function parseEquation(block) {
  return [
    parseEquationParams(block),
    parseEquationBody(block)
  ]
}

function parseEquationParams(block) {
  return getParams(block).map(argument => createNode("VariablePattern", argument))
}

function parseEquationBody(block) {
  let bodyContents = buildSequenceAst(getChild(block))
  return createNode("UnguardedBody", bodyContents)
}