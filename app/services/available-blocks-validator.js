import Ember from 'ember';
import { inject as service } from '@ember/service';

/// Este service deshabilita los bloques que no estén disponibles para una actividad
export default Ember.Service.extend({
    intl: service(),

    globalAvailableBlockTypes: ["al_empezar_a_ejecutar", "numero", "required_value", "required_statement"],
    procedureRelatedBlockTypes: ["procedures_defnoreturn", "procedures_callnoreturn", "variables_get", "param_get"],

    disableNotAvailableBlocksInWorkspace(activityBlocks) {
        Blockly.getMainWorkspace()
        .getAllBlocks()
        .filter(block => !this._isAvailable(block, activityBlocks))
        .forEach(block => this._disable(block))
    },

    _isAvailable(block, activityBlocks) {
        return  this._match(this.globalAvailableBlockTypes, block)
        ||      this._match(activityBlocks, block)
        ||      (this._match(this.procedureRelatedBlockTypes, block) && this._includes(activityBlocks, "procedimiento"))
    },

    _match(availableBlockTypes, currentBlock) {
        let aliases = currentBlock.aliases || []
        return  this._includes(availableBlockTypes, currentBlock.type)
        ||      aliases.some(alias => this._includes(availableBlockTypes, alias))
    },

    _includes(availableBlockTypes, type) {
        return availableBlockTypes
            .map(name => name.toLowerCase())
            .includes(type.toLowerCase())
    },

    _disable(block) {
        block.setDisabled(true)
        block.setWarningText(this.intl.t('blocks.errors.nonAvailableBlock').string)
    },


})