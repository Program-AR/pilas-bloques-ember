
import { isFlying, isProcedureCall, getProcedureBlock, getParams, asValueString } from '../utils/blocks'
import Service from '@ember/service'
import Ember from 'ember'

/// Este service va recibiendo los Ids de los bloques que se ejecutan y SOLAMENTE se encarga del highlighting.
/// Particularmente, tiene la lógica de highligh para los procedimientos.
/// No sabe nada sobre qué hacen o cuándo se ejecutará cada bloque.
export default Service.extend({
    
    intl: Ember.inject.service(),
    stack: [],
    highlightedProcedures: [],

    step(blockId) {
        let block = this._workspace().getBlockById(blockId);
        if (!block) {
            console.warn(`Couldn't highlight block id: ${blockId}`);
            return;
        }
        this._removeLastBlockIfEndOfModule();
        this._removePreviousBlockIfContinue(block);
        this._updateHighlight();

        if (!this._ignore(block)) {
            this.stack.push(block);
        }

        this._updateHighlight();
    },

    clear() {
        this.stack.length = 0;
        this._clearHighlight();
    },

    _lastBlock() {
        return this.stack[this.stack.length - 1];
    },

    _procedureCalls() {
        return this.stack.filter(b => isProcedureCall(b))
    },

    _removeLastBlockIfEndOfModule() {
        if (this._shouldRemoveLastBlock()) {
            this.stack.pop();
        }
    },

    _removePreviousBlockIfContinue(block) {
        while (this.stack.includes(block.getParent())) {
            this.stack.pop();
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
        this.stack.forEach((b) => this._workspace().highlightBlock(b.id, true));
        if (this._lastBlock()) this._updateProcedureHighlight();
    },

    _clearHighlight() {
        this._workspace().highlightBlock();
        this._clearProcedureHighlight();
    },

    _updateProcedureHighlight() {
        const block = this._lastBlock();
        if (!isProcedureCall(block)) return;
        const procedureBlock = getProcedureBlock(block)
        if (procedureBlock && !getParams(procedureBlock).length) return;
        if (this.highlightedProcedures.includes(procedureBlock)) return;
        this._addParametersValues(procedureBlock, block)
        this.highlightedProcedures.push(procedureBlock)
    },

    _clearProcedureHighlight() {
        const newHighlightedProcedures = []
        for (let procedureBlock of this.highlightedProcedures) {
            if (this._hasCallOnStack(procedureBlock)) {
                newHighlightedProcedures.push(procedureBlock)
                continue;
            }
            this._clearParametersValues(procedureBlock)
        }
        this.highlightedProcedures = newHighlightedProcedures
    },

    _addParametersValues(procedureBlock, procedureCallBlock) {
        const renames = getParams(procedureBlock).map((paramName, i) => {
            var value = asValueString(procedureCallBlock.getChildren()[i])
            if (value && value.startsWith('blocks.')) {
                value = this.intl.t(value)
            }
            const highlightedParamName = value ? `${paramName} = ${value}` : paramName
            return [paramName, highlightedParamName]
        })
        // First rename all parameters in the procedure block
        renames.forEach(([_, highlightedParamName], i) => {
            procedureBlock.setFieldValue(highlightedParamName, `ARG${i}`)
        })
        // Then revert rename in the procedure call block
        renames.forEach(([paramName, _], i) => {
            // Rename all procedure calls, not only current one
            this._workspace().getAllBlocks()
                .filter(b => isProcedureCall(b) && getProcedureBlock(b) == procedureBlock)
                .forEach(caller => {
                    caller.setFieldValue(paramName, `ARGNAME${i}`)
                })
        })
    },

    _clearParametersValues(procedureBlock) {
        getParams(procedureBlock).forEach((highlightedParamName, i) => {
            const paramName = highlightedParamName.split("=")[0].trim()
            procedureBlock.setFieldValue(paramName, `ARG${i}`)
        })
    },

    _hasCallOnStack(procedureBlock) {
        return this._procedureCalls().some(b => getProcedureBlock(b).id === procedureBlock.id)
    },

    _workspace() {
        return Blockly.getMainWorkspace();
    }
});