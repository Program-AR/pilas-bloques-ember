import Ember from 'ember';

export default Ember.Service.extend({
    
    blocks: [],
    workspace: Blockly.mainWorkspace,

    step(blockId) {
        let block = this.workspace.getBlockById(blockId)
        if (!block) { // For testing
            console.warn(`Couldn't highlight block id: ${blockId}`)
            return
        }
        this._removePreviousBlockIfLastOfModule()
        this._removePreviousBlockIfContinue(block)

        if (!this._ignore(block))
          this.blocks.push(block)

        this._updateHighlight()
    },

    clear() {
        this.blocks.length = 0
        this._clearHighlight()
    },
    
    _lastBlock() {
        return this.blocks[this.blocks.length - 1]
    },

    _removePreviousBlockIfLastOfModule() {
        if (this._lastBlock() && !this._lastBlock().getNextBlock())
          this.blocks.pop()
    },

    _removePreviousBlockIfContinue(block) {
        if (block.getParent() == this._lastBlock())
          this.blocks.pop()
    },

    _ignore(block) {
        return this._isModuleDefinition(block)
    },

    _isModuleDefinition(block) {
        return !block.getParent()
    },

    _updateHighlight() {
        this._clearHighlight()
        this.blocks.forEach((b) => this.workspace.highlightBlock(b.id, true))
    },

    _clearHighlight() {
        this.workspace.highlightBlock()
    }
})