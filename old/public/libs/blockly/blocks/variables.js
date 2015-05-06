/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');

// HUE VALUE BY DEFAULT
Blockly.Blocks.variables.COLOUR = 330;

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockly.Blocks.variables.COLOUR);
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },

  getVarType: function() {
    return 'global';
  },

  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
                  // this.contextMenuMsg_.replace('%1', name);
    option.text = Blockly.getBlockSvg(this.workspace, this.contextMenuType_,
      function(b) {
        b.setFieldValue(name, 'VAR');
        b.moveBy(10, 5);
      });
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(Blockly.Blocks.variables.COLOUR);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },

  getVarType: function() {
    return 'global';
  },

  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['local_var_get'] = {
  /**
   * Block for local variable getter.
   * @this Blockly.Block
   */
  init: function() {
    // TODO: set helpurl
    this.setColour(Blockly.Blocks.procedures.vars.COLOUR);
    this.appendDummyInput()
        .appendField('null', 'VAR')
    this.setOutput(true);
    this.getField_('VAR').EDITABLE = true; // to save field in XML
    // TODO: set tooltip
    // this.setTooltip(Blockly.Msg.PARAM_GET_TOOLTIP);
  },

  getVarType: function() {
    return 'local';
  },

  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },

  getName: function() {
    return this.getFieldValue('VAR');
  },

  setName: function(newName) {
    return this.setFieldValue(newName, 'VAR');
  },

  /**
   * Notification that a var is renaming.
   * If the name matches one of this block's params, rename it.
   * @param {string} oldName Previous name of param.
   * @param {string} newName Renamed param.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName, defName) {
    if(this.isFromDef(defName)) {
      if (Blockly.Names.equals(oldName, this.getName())) {
        this.setName(newName);
      }
    }
  }
};

Blockly.Blocks['local_var_set'] = {
  /**
   * Block for local variable setter.
   * @this Blockly.Block
   */
  init: function() {
    // TODO: set helpurl
    this.setColour(Blockly.Blocks.procedures.vars.COLOUR);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // TODO: set tooltip
    // this.setTooltip(Blockly.Msg.PARAM_GET_TOOLTIP);
  },

  getVarType: function() {
    return 'local';
  },

  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getName();
    option.text = Blockly.getBlockSvg(this.workspace, 'local_var_get',
      function(b) {
        b.setFieldValue(name, 'VAR');
        b.moveBy(10, 5);
      });
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', 'local_var_get');
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },

  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },

  getName: function() {
    return this.getFieldValue('VAR');
  },

  setName: function(newName) {
    return this.setFieldValue(newName, 'VAR');
  },

  /**
   * Notification that a var is renaming.
   * If the name matches one of this block's params, rename it.
   * @param {string} oldName Previous name of param.
   * @param {string} newName Renamed param.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName, defName) {
    if(this.isFromDef(defName)) {
      if (Blockly.Names.equals(oldName, this.getName())) {
        this.setName(newName);
      }
    }
  }
};

