import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Toto escritor", () => {

  actividadTest("5.I1a", {
    descripcionAdicional: '5.I1a: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">7</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
              <next>
                <block type="EscribirLetraActualEnOtraCuadricula"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

  actividadTest("5.I1a", {
    descripcionAdicional: '5.I1a: No puede copiar la letra en un casillero vacío',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="EscribirLetraActualEnOtraCuadricula"></block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "No hay una letra aquí"
  });

  actividadTest("5.I1a", {
    descripcionAdicional: '5.I1a: No puede salir de la cuadrícula',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="MoverACasillaIzquierda"></block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "No puedo ir para la izquierda"
  });

  actividadTest("5.I1a", {
    descripcionAdicional: '5.I1a: No puede escribir de más',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="Repetir">
              <value name="count">
                <block type="math_number">
                  <field name="NUM">8</field>
                </block>
              </value>
              <statement name="block">
                <block type="EscribirLetraActualEnOtraCuadricula"></block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "¡Estoy cansado! No quiero escribir más..."
  });

  actividadTest("5.I1b", {
    descripcionAdicional: '5.I1b: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">7</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
              <next>
                <block type="EscribirTextoDadoEnOtraCuadricula">
                  <field name="texto">x</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

  actividadTest("5.I1b", {
    descripcionAdicional: '5.I1b: Solamente escribir sin moverse NO resuelve el desafio',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">7</field>
            </block>
          </value>
          <statement name="block">
            <block type="EscribirTextoDadoEnOtraCuadricula">
              <field name="texto">x</field>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
    resuelveDesafio: false
  });

  actividadTest("5.I1c", {
    descripcionAdicional: '5.I1c: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">7</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
              <next>
                <block type="EscribirLetraActualEnOtraCuadricula">
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="hayVocalRMT">
                          <field name="letra">m</field>
                        </block>
                      </value>
                      <statement name="block">
                        <block type="EscribirTextoDadoEnOtraCuadricula">
                          <field name="texto">ich</field>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

  actividadTest("5.I1c", {
    descripcionAdicional: '5.I1c: No puede preguntar sobre la letra actual en un casillero vacío',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="si">
          <value name="condition">
            <block type="hayVocalRMT">
              <field name="letra">m</field>
            </block>
          </value>
          <statement name="block">
            <block type="EscribirTextoDadoEnOtraCuadricula">
              <field name="texto">ich</field>
            </block>
          </statement>
          <next>
            <block type="MoverACasillaDerecha"></block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "No hay una letra aquí"
  });

  actividadTest("5.I1d", {
    descripcionAdicional: '5.I1d: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="382" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">7</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
              <next>
                <block type="EscribirLetraActualEnOtraCuadricula">
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="hayVocalRMT">
                          <field name="letra">a</field>
                        </block>
                      </value>
                      <statement name="block">
                        <block type="EscribirTextoDadoEnOtraCuadricula">
                          <field name="texto">pa</field>
                        </block>
                      </statement>
                      <next>
                        <block type="si">
                          <value name="condition">
                            <block type="hayVocalRMT">
                              <field name="letra">e</field>
                            </block>
                          </value>
                          <statement name="block">
                            <block type="EscribirTextoDadoEnOtraCuadricula">
                              <field name="texto">pe</field>
                            </block>
                          </statement>
                          <next>
                            <block type="si">
                              <value name="condition">
                                <block type="hayVocalRMT">
                                  <field name="letra">i</field>
                                </block>
                              </value>
                              <statement name="block">
                                <block type="EscribirTextoDadoEnOtraCuadricula">
                                  <field name="texto">pi</field>
                                </block>
                              </statement>
                              <next>
                                <block type="si">
                                  <value name="condition">
                                    <block type="hayVocalRMT">
                                      <field name="letra">o</field>
                                    </block>
                                  </value>
                                  <statement name="block">
                                    <block type="EscribirTextoDadoEnOtraCuadricula">
                                      <field name="texto">po</field>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="si">
                                      <value name="condition">
                                        <block type="hayVocalRMT">
                                          <field name="letra">u</field>
                                        </block>
                                      </value>
                                      <statement name="block">
                                        <block type="EscribirTextoDadoEnOtraCuadricula">
                                          <field name="texto">pu</field>
                                        </block>
                                      </statement>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

  actividadTest("5.I1d", {
    descripcionAdicional: 'Se brinda un mensaje de error al intentar escribir un carácter inválido',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="378" y="15">
      <statement name="program">
        <block type="EscribirTextoDadoEnOtraCuadricula">
          <field name="texto">¡HOLA!</field>
        </block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: 'No sé escribir ese símbolo'
  });

});
