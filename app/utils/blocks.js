export const entryPointType = 'al_empezar_a_ejecutar'

export function isFlying(block) {
  return block.getRootBlock() === block
}

export function allBlocksNestingControlStructures(workspace = Blockly.mainWorkspace){
  const blockNames = allProcedures(workspace).filter(nestsControlStructures).map(getName)
  if(nestsControlStructures(getEntryPointBlock(workspace))){
    blockNames.push(entryPointType)
  } 
  return blockNames
}

export function allProcedures(workspace = Blockly.mainWorkspace) {
  return workspace.getTopBlocks().filter(isProcedure)
}

export function allProcedureNames(workspace) {
  return allProcedures(workspace).map(getName)
}

export function declarationWithName(name, workspace = Blockly.mainWorkspace) {
  return entryPointType == name 
  ? getEntryPointBlock(workspace) //TODO: Move to gral place
  : allProcedures(workspace).find(p => getName(p) == name)
}

function getEntryPointBlock(workspace){
  return workspace.getAllBlocks().find(b => b.type === entryPointType)
}

//Control structure nesting

export function nestsControlStructures(procedure){
  const controlStructureBlocks = procedure.getDescendants().filter(isControlStructure)
  return directlyNestsControlStructures(controlStructureBlocks) || indirectlyNestsControlStructures(controlStructureBlocks)
}

function directlyNestsControlStructures(controlStructureBlocks){
  return controlStructureBlocks.some(isSurroundedByControlStructure)
}

function isSurroundedByControlStructure(block){
  return isControlStructure(block.getSurroundParent())
}

function indirectlyNestsControlStructures(controlStructureBlocks){
  return controlStructureBlocks.some(b => getProceduresCallsSurroundedBy(b).some(usesControlStructure))
}

function getProceduresCallsSurroundedBy(block){
  return getBlocksSurroundedBy(block).filter(isProcedureCall)
}

function getBlocksSurroundedBy(block){
  return block.getDescendants()
      .slice(1)
      .filter(b => b.getSurroundParent().id === block.id)
}

/**
 * @returns procedure block that matches a call block
 */
function getProcedureBlock(procedureCallBlock){
  return declarationWithName(procedureCallBlock.getFieldValue('NAME'))
}

export function usesControlStructure(procedureCallBlock){
  try {
    return getBlocksSurroundedByProcedure(procedureCallBlock).some(isControlStructure)
  } catch (e) {
    console.error(e)
    return false
  }
}

function getBlocksSurroundedByProcedure(procedureCallBlock){
  return getBlocksSurroundedBy(getProcedureBlock(procedureCallBlock))
}

export function getNestedControlStructureBlocks(declaration){
  return declarationWithName(declaration)
    .getDescendants()
    .filter(b => isControlStructure(b) && isSurroundedByControlStructure(b))
}


// TODO: No acoplarse a la categoria
export function isOperator(block) {
  return block.categoryId == "operators"
}
export function isValue(block) {
  return block.categoryId == "values"
}

const controlStructureCategories = ["repetitions", "alternatives"]

function isControlStructure(block) {
  return controlStructureCategories.some(c => c == block.categoryId )
}

export function isProcedure(block) {
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
  while (block.getNextBlock()) {
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
  return connection.getShadowDom() == null // Should have not a shadow block
    && [Blockly.INPUT_VALUE, Blockly.NEXT_STATEMENT].includes(connection.type) // Should be a "block hole"
}

function requiredInput(block, inputName) {
  let connection = block.getInput(inputName).connection
  let shadowType = (connection.type == Blockly.INPUT_VALUE)
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

const setWarningBubbleColour = (block, colour) => {
  const unBoundedSetVisible = Blockly.Warning.prototype.setVisible
  const boundedSetVisible = unBoundedSetVisible.bind(block.warning)
  block.warning.setVisible = (visible) => { boundedSetVisible(visible); if (visible) block.warning.bubble_.setColour(colour) }
}

const addWarningToBlock = (block, itemChar, message, index, bubbleColour) => {
  const text = `${itemChar} ${lineWrap(message)}`
  block.setWarningText(text, index)
  setWarningBubbleColour(block, bubbleColour)
  block.warning.setVisible(true)
}

export function addWarning(block, message, index) {
  addWarningToBlock(block, '☆', message, index, 'yellow')
}

export function addError(block, message, index) {
  addWarningToBlock(block, '★', message, index, 'red')
}

function textWasChanged(fieldName, event) {
  return event.element === 'field' && event.name === fieldName && (event.oldValue !== event.newValue)
}

function isATextChangeEvent(fieldName) {
  return function (event) {
    return event.blockId === this.id && textWasChanged(fieldName, event)
  }
}

function isAnyParentBlockDisabled(block) {
  const parent = block.parentBlock_
  if (!parent) return false
  return parent.disabled || isAnyParentBlockDisabled(parent)
}

function onChange(matchesEventKind, onTrigger) {
  return function (event) {
    if (this.disabled || isAnyParentBlockDisabled(this)) {
      clearValidationsFor(this)
      return
    }
    if (event && (event.runCode || matchesEventKind.call(this, event))) {
      onTrigger.call(this)
    }
  }
}

export function onChangeForTextInputBlock(errorMessage, fieldName) {
  return onChange(
    isATextChangeEvent(fieldName),
    function () {
      if (this.hasError()) {
        addError(this, errorMessage)
      }
      else {
        clearValidationsFor(this)
      }
    }
  )
}

function fillOpacity(block, opacity) {
  block.getSvgRoot().style["fill-opacity"] = opacity
}

export function transparent(block) {
  fillOpacity(block, 0)
}

function opaque(block) {
  fillOpacity(block, 1)
}

export function onChangeRequired(warningText) {
  return onChange(
    (/* event */) => false,
    function () {
      addError(this, warningText)
      opaque(this)
    }
  )
}

function lineWrap(message) {
  const lineLen = 75
  return message.split(' ').reduce((lines, word) => {
    const lastLine = lines[lines.length - 1]
    if (lastLine.length + word.length > lineLen)
      lines.push(word)
    else
      lines.push(lines.pop() + ' ' + word)
    return lines
  },
    [""]
  ).join('\n  ')
}