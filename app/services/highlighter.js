
import { isFlying, isProcedureCall, getProcedureBlock, getParams } from '../utils/blocks'
import Service from '@ember/service'

/// Este service va recibiendo los Ids de los bloques que se ejecutan y SOLAMENTE se encarga del highlighting.
/// Particularmente, tiene la lógica de highligh para los procedimientos.
/// No sabe nada sobre qué hacen o cuándo se ejecutará cada bloque.
export default Service.extend({

    blocks: [],
    highlightedProcedures: [],

    step(blockId) {
        let block = this._workspace().getBlockById(blockId);
        if (!block) {
            console.warn(`Couldn't highlight block id: ${blockId}`);
            return;
        }
        this._removeLastBlockIfEndOfModule();
        this._removePreviousBlockIfContinue(block);

        if (!this._ignore(block)) {
            this.blocks.push(block);
        }

        this._updateHighlight();
    },

    clear() {
        this.blocks.length = 0;
        this._clearHighlight();
    },

    _lastBlock() {
        return this.blocks[this.blocks.length - 1];
    },

    _procedureCalls() {
        return this.blocks.filter(b => isProcedureCall(b))
    },

    _removeLastBlockIfEndOfModule() {
        if (this._shouldRemoveLastBlock()) {
            this.blocks.pop();
        }
    },

    _removePreviousBlockIfContinue(block) {
        if (block.getParent() === this._lastBlock()) {
            this.blocks.pop();
        }
    },

    _ignore(block) {
        return isFlying(block);
    },

    _shouldRemoveLastBlock() {
        return this._lastBlock() &&
            this._isEndOfModule(this._lastBlock()) &&
            !isProcedureCall(this._lastBlock());
    },

    _isEndOfModule(block) {
        return !block.getNextBlock();
    },

    _updateHighlight() {
        this._clearHighlight();
        this.blocks.forEach((b) => this._workspace().highlightBlock(b.id, true));
        if (this._lastBlock()) this._updateProcedureHighlight();
    },

    _updateProcedureHighlight() {
        const block = this._lastBlock();
        if (!isProcedureCall(block)) return;
        const procedureBlock = getProcedureBlock(block)
        if (this.highlightedProcedures.includes(procedureBlock)) return;
        const param = procedureBlock.getFieldValue("ARG0")
        const value = block.getChildren()[0].getFieldValue("NUM")
        const highlightedParamName = `${param} = ${value}`
        procedureBlock.setFieldValue(highlightedParamName, "ARG0")
        block.setFieldValue(param, "ARGNAME0")
        this.highlightedProcedures.push(procedureBlock)
    },

    _clearHighlight() {
        this._workspace().highlightBlock();
        this._clearProcedureHighlight();
    },

    _clearProcedureHighlight() {
        const newHighlightedProcedures = []
        for(let procedureBlock of this.highlightedProcedures) {
            if (this._procedureCalls().some(b => getProcedureBlock(b) === procedureBlock)) {
                newHighlightedProcedures.push(procedureBlock)
                break;
            }
            const param = procedureBlock.getFieldValue("ARG0")
            const paramName = param.split("=")[0].trim()
            procedureBlock.setFieldValue(paramName, "ARG0")
            
        }
        this.highlightedProcedures = newHighlightedProcedures
    },

    _workspace() {
        return Blockly.getMainWorkspace();
    }
});