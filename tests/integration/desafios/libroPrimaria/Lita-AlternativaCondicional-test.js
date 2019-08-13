import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Lita - Alternativa condicional", () => {

  actividadTest("5.1.4a", {
    descripcionAdicional: '5.1.4a: Se puede resolver (solución 1)',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="SiNo">
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

  actividadTest("5.1.4a", {
    descripcionAdicional: '5.1.4a: Se puede resolver (solución 2)',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="SiNo">
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

  actividadTest("5.1.4a", {
    descripcionAdicional: '5.1.4a: Se puede resolver (solución 3)',
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


  actividadTest("5.2.1c", {
    descripcionAdicional: "5.2.1c: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="Repetir">
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


  // Se necesita implementar un algoritmo de mocking para resolver los tests en donde pueda haber un tomate o una lechuga.


  actividadTest("5.2.1c", {
    descripcionAdicional: "3.1.4a: Solo se puede preparar ensalada si hay ensaladera",
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="aeQFM$g(t%`)|=s~[]yA" deletable="false" movable="false" editable="false" x="271" y="15"><statement name="program"><block type="PrepararEnsalada" id="!FM]Q.=?#.H_Yox_6Q.?"></block></statement></block></xml>',
    resuelveDesafio: false,
    errorEsperado: "¡Acá no hay ensaladera!",
  });


  actividadTest("5.2.1c", {
    descripcionAdicional: "3.1.4a: No se puede preparar ensalada aun, faltan recoger todas las verduras restantes",
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="m+bao0~F%Q;[seB/+6/3" deletable="false" movable="false" editable="false" x="271" y="15"><statement name="program"><block type="Repetir" id="%6n:[itB,;QL.6sXUuIx"><value name="count"><block type="math_number" id="U.-e{r/vX+Z(A5mz+i5:"><field name="NUM">7</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id=",G_SMDg%CGYuVOpeZBf3"></block></statement><next><block type="PrepararEnsalada" id="Z~_|BigUji_!L?Q-DxdR"></block></next></block></statement></block></xml>',
    resuelveDesafio: false,
    errorEsperado: "¡Todavía me quedan ingredientes por recoger!",
  });

});