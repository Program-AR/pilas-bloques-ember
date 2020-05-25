import Blockly from 'blockly'

const blockBuilder = {
    createCustomBlock(name, options, callback_to_change_block) {
    options.colour = options.colour || '#4453ff';

    if (Blockly.Blocks[name]) {
      //console.warn(`Redefiniendo el bloque ${name}`);
    }

    Blockly.Blocks[name] = {
      init: function () {
        this.jsonInit(options);

        if (callback_to_change_block) {
          callback_to_change_block.call(this);
        }

      }
    };

    Blockly.Blocks[name].isCustomBlock = true;

    if (!Blockly.MyLanguage) {
      Blockly.MyLanguage = Blockly.JavaScript;
    }

    if (options.code) {
      Blockly.MyLanguage[name] = function (block) {
        let variables = options.code.match(/\$(\w+)/g);
        let code = options.code;

        if (variables) {
          variables.forEach((v) => {
            let regex = new RegExp('\\' + v, "g");
            let variable_name = v.slice(1);

            var variable_object = null;

            if (variable_name === "DO") {
              variable_object = Blockly.JavaScript.statementToCode(block, variable_name);
            } else {
              variable_object = Blockly.MyLanguage.valueToCode(block, variable_name) || block.getFieldValue(variable_name) || null;
            }

            code = code.replace(regex, variable_object);
          });
        }

        return code;
      };
    }

    return Blockly.Blocks[name];
  },

  createBlockWithAsyncDropdown(name, options) {
    function callback_to_change_block() {
      this.appendDummyInput()
        .appendField(options.label || "")
        .appendField(new Blockly.FieldDropdown(options.callbackDropdown), 'DROPDOWN_VALUE');
    }

    return this.createCustomBlock(name, options, callback_to_change_block);
  },

  createCustomBlockWithHelper(name, options) {
    let block_def = {
      message0: options.descripcion,
      colour: options.colour || '#4a6cd4',
      previousStatement: true,
      nextStatement: true,
      args0: [],
      code: options.code || `hacer(actor_id, "${options.comportamiento}", ${options.argumentos});`,
    };

    if (options.icono) {
      block_def.message0 = `%1 ${options.descripcion}`;
      block_def.args0.push({
        "type": "field_image",
        "src": `${options.icono}`,
        "width": 16,
        "height": 16,
        "alt": "*"
      });
    }
    return this.createCustomBlock(name, block_def);
  },

  createBlockValue(name, options) {
    let block = this.createCustomBlock(name, {
      message0: `%1 ${options.descripcion}`,
      colour: options.colour || '#4a6cd4',
      output: 'String',
      args0: [
        {
          "type": "field_image",
          "src": `${options.icono}`,
          "width": 16,
          "height": 16,
          "alt": "*"
        }
      ],
    });

    Blockly.MyLanguage[name] = function () {
      return [`'${options.valor}'`, Blockly.JavaScript.ORDER_ATOMIC];
    };

    return block;
  },

  getBlocksList() {
    return Object.keys(Blockly.Blocks);
  },

  getCustomBlocksList() {
    return Object.keys(Blockly.Blocks).filter((e) => {
      return Blockly.Blocks[e].isCustomBlock;
    }
    );
  },

  createAlias(new_name, original_block_name) {
    let original_block = Blockly.Blocks[original_block_name];
    Blockly.Blocks[new_name] = Object.assign({}, original_block);
    Blockly.Blocks[new_name].isCustomBlock = true;
    Blockly.Blocks[original_block_name].alias = new_name;

    if (!Blockly.MyLanguage) {
      Blockly.MyLanguage = Blockly.JavaScript;
    }

    Blockly.MyLanguage[new_name] = Blockly.JavaScript[original_block_name];

    return Blockly.Blocks[new_name];
  },

  setStartHat(state) {
    Blockly.BlockSvg.START_HAT = state;
  }
}

export default blockBuilder;
