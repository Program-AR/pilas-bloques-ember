export function createBlock(type) {
    return Blockly.mainWorkspace.newBlock(type) 
}
  
export function findBlockByTypeIn(rootBlock, type) {
    if (!rootBlock) return null
    if (rootBlock.type == type) return rootBlock
    return rootBlock.getChildren().map(b => findBlockByTypeIn(b, type)).find(b => b != undefined)
}


////// ASSERT //////

export function assertAsync(assert, fn) {
    let done = assert.async(1)
    setTimeout(function() {
        fn(); done()
    })
}
  
export function assertDisabled(assert, block) {
    assert.ok(block.disabled)
}

export function assertNotDisabled(assert, block) {
    assert.notOk(block.disabled)
}

export function assertWarning(assert, block, warning) {
    assert.equal(block.warning.getText(), warning) 
}

export function assertNotWarning(assert, block) {
    assert.notOk(block.warning)
}