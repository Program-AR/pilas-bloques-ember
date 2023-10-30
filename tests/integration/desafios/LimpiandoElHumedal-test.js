import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'LimpiandoElHumedal';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <variables></variables>\n  <block type="MoverACasillaIzquierda" disabled="true" x="-573" y="-33"></block>\n  <block type="repetir" disabled="true" x="-300" y="-12">\n    <value name="count">\n      <shadow type="required_value"></shadow>\n      <block type="math_number">\n        <field name="NUM">10</field>\n      </block>\n    </value>\n    <statement name="block">\n      <shadow type="required_statement"></shadow>\n    </statement>\n  </block>\n  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">\n    <statement name="program">\n      <shadow type="required_statement"></shadow>\n      <block type="repetir">\n        <value name="count">\n          <shadow type="required_value"></shadow>\n          <block type="math_number">\n            <field name="NUM">3</field>\n          </block>\n        </value>\n        <statement name="block">\n          <shadow type="required_statement"></shadow>\n          <block type="repetir">\n            <value name="count">\n              <shadow type="required_value"></shadow>\n              <block type="math_number">\n                <field name="NUM">3</field>\n              </block>\n            </value>\n            <statement name="block">\n              <shadow type="required_statement"></shadow>\n              <block type="MoverACasillaArriba"></block>\n            </statement>\n            <next>\n              <block type="TomarLata">\n                <next>\n                  <block type="repetir">\n                    <value name="count">\n                      <shadow type="required_value"></shadow>\n                      <block type="math_number">\n                        <field name="NUM">3</field>\n                      </block>\n                    </value>\n                    <statement name="block">\n                      <shadow type="required_statement"></shadow>\n                      <block type="MoverACasillaAbajo"></block>\n                    </statement>\n                    <next>\n                      <block type="Colocar"></block>\n                    </next>\n                  </block>\n                </next>\n              </block>\n            </next>\n          </block>\n        </statement>\n        <next>\n          <block type="repetir">\n            <value name="count">\n              <shadow type="required_value"></shadow>\n              <block type="math_number">\n                <field name="NUM">3</field>\n              </block>\n            </value>\n            <statement name="block">\n              <shadow type="required_statement"></shadow>\n              <block type="repetir">\n                <value name="count">\n                  <shadow type="required_value"></shadow>\n                  <block type="math_number">\n                    <field name="NUM">3</field>\n                  </block>\n                </value>\n                <statement name="block">\n                  <shadow type="required_statement"></shadow>\n                  <block type="MoverACasillaArriba"></block>\n                </statement>\n                <next>\n                  <block type="repetir">\n                    <value name="count">\n                      <shadow type="required_value"></shadow>\n                      <block type="math_number">\n                        <field name="NUM">4</field>\n                      </block>\n                    </value>\n                    <statement name="block">\n                      <shadow type="required_statement"></shadow>\n                      <block type="MoverACasillaDerecha"></block>\n                    </statement>\n                    <next>\n                      <block type="TomarPapel">\n                        <next>\n                          <block type="repetir">\n                            <value name="count">\n                              <shadow type="required_value"></shadow>\n                              <block type="math_number">\n                                <field name="NUM">3</field>\n                              </block>\n                            </value>\n                            <statement name="block">\n                              <shadow type="required_statement"></shadow>\n                              <block type="MoverACasillaAbajo"></block>\n                            </statement>\n                            <next>\n                              <block type="repetir">\n                                <value name="count">\n                                  <shadow type="required_value"></shadow>\n                                  <block type="math_number">\n                                    <field name="NUM">4</field>\n                                  </block>\n                                </value>\n                                <statement name="block">\n                                  <shadow type="required_statement"></shadow>\n                                  <block type="MoverACasillaIzquierda"></block>\n                                </statement>\n                                <next>\n                                  <block type="Colocar"></block>\n                                </next>\n                              </block>\n                            </next>\n                          </block>\n                        </next>\n                      </block>\n                    </next>\n                  </block>\n                </next>\n              </block>\n            </statement>\n            <next>\n              <block type="MoverACasillaDerecha">\n                <next>\n                  <block type="MoverACasillaDerecha">\n                    <next>\n                      <block type="IrseEnYacare"></block>\n                    </next>\n                  </block>\n                </next>\n              </block>\n            </next>\n          </block>\n        </next>\n      </block>\n    </statement>\n  </block>\n</xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al tirar en el tacho cuando no tengo nada',
		solucion:'<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="J;fm@E$*cAyjoQ^q-(]#" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="-8!hD4cmMC#/Tt`z`oCm"></shadow><block type="Colocar" id="^7J6N9H`ifIJ[+gs|S5H"></block></statement></block></xml>',
		errorEsperado: 'No tengo nada en la mano'
	});

	actividadTest(nombre, {
		descripcionAdicional: ' Da error al querer irse sin limpiar el humedal',
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
		<variables></variables>
		<block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
		  <statement name="program">
			<shadow type="required_statement"></shadow>
			<block type="MoverACasillaDerecha">
			  <next>
				<block type="MoverACasillaDerecha">
				  <next>
					<block type="IrseEnYacare"></block>
				  </next>
				</block>
			  </next>
			</block>
		  </statement>
		</block>
	  </xml>`,
		errorEsperado: '¡No puedo irme sin antes haber limpiado el humedal!'		
	});

});