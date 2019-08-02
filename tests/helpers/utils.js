export function findBlockByTypeIn(rootBlock, type) {
    let block = rootBlock.type == type ? rootBlock : findChildren(rootBlock, type)
    return block
}

function findChildren(rootBlock, type) {
    return rootBlock.getChildren().find((b) => b.type == type) || findChildren(rootBlock.getChildren()[0], type)
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