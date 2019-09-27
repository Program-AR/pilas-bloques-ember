// Code here will be linted with JSHint.
/* jshint ignore:start */
import Service from '@ember/service';

export default Service.extend({

  //TODO: Recibir el workspace??
  analyze(mainBlock, expectations = []) {
    let ast = this.parse(mainBlock)
    
    let result = mulang.analyse({
      "sample" : {
        "tag": "MulangSample",
        "ast": ast
      },
      "spec": {
        "expectations": expectations,
        "smellsSet": {
          "tag": 'NoSmells',
        }
      }
    })
    // console.log({result});

    return result
  },

  parse(mainBlock) {
    return buildBlockAst(mainBlock);
  },

});


function buildBlockAst(block) {
  let tag = mulangTag(block);
  return createNode(tag, mulangParsers[tag](block));
}

function mulangTag(block) {
  let tag = pilasToMulangTags[block.type]
  if (tag) return tag
  return block.categoria == "Valores" ? "Reference" : "Application"
}

let pilasToMulangTags = {
  "al_empezar_a_ejecutar": "EntryPoint",
  "repetir": "Repeat",
  "Si": "If",
  "SiNo": "If",
  "Hasta": "While",
  "math_number": "MuNumber",
  "procedures_defnoreturn": "Procedure",
  "variables_get": "Reference",
}


function parseMuNumber(block) {
  return parseFloat(block.getFieldValue("NUM"));
}

function parseEntryPoint(block) {
  return [
    block.type, 
    buildSequenceAst(getChild(block))
  ]
}

function parseApplication(block) {
  return [
    createReference(block),
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
  let text = block.getFieldValue("texto") // TODO: Mega-hard-coded
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
  if (block.type == "Si") //TODO
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
    buildEmptyNode()
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
    getProcedureName(block),
    createNode("Equation", parseEquation(block))
  ];
}

function parseEquation(block) {
  return [
    parseEquationParams(block),
    parseEquationBody(block)
  ]
}

function parseEquationParams(block) {
  return getParams(block).map( argument => createNode("VariablePattern", argument) );
}

function parseEquationBody(block) {
  let bodyContents = buildSequenceAst(getChild(block));
  return createNode("UnguardedBody", bodyContents);
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






// TODO: Duplicate from blocks-gallery
function getProcedureName(procedureBlock) { 
  return procedureBlock.getProcedureDef()[0];
}
function getParams(procedureBlock) {
  return procedureBlock.getProcedureDef()[1]
}




function createNode(tag, contents) {
  if(tag === "Equation") return [contents];
  return contents !== undefined ? {tag, contents} : {tag};
}

function createReference(block) {
  return createNode("Reference", block.type)
}

function buildEmptyNode() {
  return createNode("None", []);
}

function buildSequenceAst(topLevelBlock) {
  if (!topLevelBlock) return buildEmptyNode();
  let siblings = getBlockSiblings(topLevelBlock);
  if (siblings.length) {
    return createNode("Sequence", [topLevelBlock, ...siblings].map(b => buildBlockAst(b)))
  } else {
    return buildBlockAst(topLevelBlock);
  }
}

function hasSiblings(block) {
  return block.getNextBlock() 
}

function getBlockSiblings(block) {
  const siblings = [];
  while (hasSiblings(block)){
    block = nextBlockFor(block);
    siblings.push(block);
  }
  return siblings;
}

function nextBlockFor(block) {
  return block.getNextBlock();
}

function getChild(block) {
  return block.getChildren()[0]
}
// Code here will be ignored by JSHint.
/* jshint ignore:end */
