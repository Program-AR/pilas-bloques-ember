import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Lita - Alternativa condicional");

actividadTest("4.1.4a", {
  descripcionAdicional: '4.1.4a: Se puede resolver (solución 1)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="sino">
                  <value name="condition">
                    <block type="HayTomate"></block>
                  </value>
                  <statement name="block1">
                    <block type="AgarrarTomate"></block>
                  </statement>
                  <statement name="block2">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
});

actividadTest("4.1.4a", {
  descripcionAdicional: '4.1.4a: Se puede resolver (solución 2)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="sino">
                  <value name="condition">
                    <block type="HayLechuga"></block>
                  </value>
                  <statement name="block1">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                  <statement name="block2">
                    <block type="AgarrarTomate"></block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
});

actividadTest("4.1.4a", {
  descripcionAdicional: '4.1.4a: Se puede resolver (solución 3)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="si">
                  <value name="condition">
                    <block type="HayLechuga"></block>
                  </value>
                  <statement name="block">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="HayTomate"></block>
                      </value>
                      <statement name="block">
                        <block type="AgarrarTomate"></block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
});


actividadTest("4.2.1c", {
  descripcionAdicional: "4.2.1c: Se puede resolver",
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">6</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaAbajo">
              <next>
                <block type="si">
                  <value name="condition">
                    <block type="HayTomate"></block>
                  </value>
                  <statement name="block">
                    <block type="AgarrarTomate"></block>
                  </statement>
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="HayLechuga"></block>
                      </value>
                      <statement name="block">
                        <block type="AgarrarLechuga"></block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="MoverACasillaAbajo">
              <next>
                <block type="PrepararEnsalada"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
});
