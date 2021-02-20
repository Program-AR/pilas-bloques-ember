import Service from '@ember/service'
import { getName, getParams, getChild, getBlockSiblings, isOperator, isValue, isProcedureCall } from './block-utils'
import { createNode, createReference, createEmptyNode } from './pilas-ast'

export default Service.extend({

  parseAll(workspace) {
    return workspace.getTopBlocks().map(this.parse)
  },

  parse(mainBlock) {
    return buildBlockAst(mainBlock)
  },

})

function buildBlockAst(block) {
  let tag = mulangTag(block)
  return createNode(tag, mulangParsers[tag](block))
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

function mulangTag(block) {
  let tag = pilasToMulangTags[block.type]
  if (tag) return tag
  return isValue(block) ? "Reference" : "Application"
}

let pilasToMulangTags = {
  "al_empezar_a_ejecutar": "EntryPoint",
  "repetir": "Repeat",
  "Si": "If",
  "SiNo": "If",
  "Hasta": "While",
  "math_number": "MuNumber",
  "Numero": "MuNumber",
  "procedures_defnoreturn": "Procedure",
  "variables_get": "Reference", //TODO: Model each one with tag & parse
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
  return  isProcedureCall(block) ? block.getFieldValue('NAME')
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
  if (block.type == "variables_get") //TODO
    return parseVariable(block)
  else
    return block.type
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

function parseAbstractIf(block) {
  if (block.type == "Si")
    return parseIf(block)
  else
    return parseIfElse(block)
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

let mulangParsers = {
  "Application": parseApplication,
  "Reference": parseReference,
  "Repeat": parseRepeat,
  "While": parseWhile,
  "If": parseAbstractIf,
  "Procedure": parseProcedure,
  "MuNumber": parseMuNumber,
  "EntryPoint": parseEntryPoint
}
