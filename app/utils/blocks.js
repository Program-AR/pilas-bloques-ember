export const entryPointType = 'al_empezar_a_ejecutar'

export function isFlying(block) {
  return block.getRootBlock() === block
}

export function allProcedures(workspace = Blockly.mainWorkspace) {
  return workspace.getTopBlocks().filter(isProcedure)
}

export function allProcedureNames(workspace) {
  return allProcedures(workspace).map(getName)
}

export function declarationWithName(name, workspace = Blockly.mainWorkspace) {
  return entryPointType == name 
  ? workspace.getAllBlocks().find(b => b.type === entryPointType) //TODO: Move to gral place
  : allProcedures(workspace).find(p => getName(p) == name)
}

// TODO: No acoplarse a la categoria
export function isOperator(block) {
  return block.categoria == "Operadores"
}
export function isValue(block) {
  return block.categoria == "Valores"
}

export function isProcedure(block){
  return Blockly.isProcedure(block.type)
}

export function isProcedureCall(block) {
  return !!block.defType_
}

export function isInsideProcedureDef(paramBlock) {
  return paramBlock.getRootBlock().id === paramBlock.$parent
}

export function hasParam(procedureBlock, paramBlock) {
  return getParams(procedureBlock).includes(paramBlock.getFieldValue('VAR'))
}

export function getName(procedureBlock) {
  return procedureBlock.getProcedureDef()[0]
}

export function getParams(procedureBlock) {
  return procedureBlock.getProcedureDef()[1]
}

export function getBlockSiblings(block) {
  const siblings = [];
  while (block.getNextBlock()){
    block = block.getNextBlock()
    siblings.push(block);
  }
  return siblings;
}

export function getChild(block) {
  return block.getChildren()[0]
}

// Agrega un required shadow a todos los input que sean para encastrar otros bloques
export function requiredAllInputs(block) {
  block.inputList
  .filter(input => input.connection && shouldAddRequiredShadow(input.connection))
  .forEach(input => requiredInput(block, input.name))
}

function shouldAddRequiredShadow(connection) {
  return  connection.getShadowDom() == null // Should have not a shadow block
  &&      [Blockly.INPUT_VALUE, Blockly.NEXT_STATEMENT].includes(connection.type) // Should be a "block hole"
}

function requiredInput(block, inputName) {
  let connection = block.getInput(inputName).connection
  let shadowType =  (connection.type == Blockly.INPUT_VALUE)
                    ? "required_value"
                    : "required_statement"
  var shadowValue = Blockly.Xml.textToDom(`<shadow type="${shadowType}"></shadow>`)
  connection.setShadowDom(shadowValue)
  if (!connection.targetConnection)
    connection.respawnShadow_()
}


export function clearValidations(workspace = Blockly.mainWorkspace) {
  workspace.getAllBlocks().filter(b => b.warning).forEach(clearValidationsFor)
}

export function clearValidationsFor(block) {
  block.setWarningText(null)
}

export function addWarning(block, message, index) {
  block.setWarningText(message, index)
  block.warning.setVisible(true)
  block.warning.bubble_.setColour('yellow')
}

export function addError(block, message, index) {
  addWarning(block, message, index)
  block.warning.bubble_.setColour('red')
}