import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Tecnopolis 2021 - Con Coty", () => {
  actividadTest("tecnopolis2021CotyNivel6", {
    descripcionAdicional: "tecnopolis2021CotyNivel6: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"322\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverIzquierdaDibujando\">
          <next>
            <block type=\"SaltarDerecha\">
              <next>
                <block type=\"MoverDerechaDibujando\">
                  <next>
                    <block type=\"SaltarIzquierda\">
                      <next>
                        <block type=\"MoverAbajoDibujando\">
                          <next>
                            <block type=\"MoverAbajoDibujando\"></block>
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
  </xml>`
  })
  actividadTest("tecnopolis2021CotyNivel7", {
    descripcionAdicional: "tecnopolis2021CotyNivel7: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"322\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">3</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverArribaDibujando\">
              <next>
                <block type=\"MoverDerechaDibujando\">
                  <next>
                    <block type=\"MoverAbajoDibujando\">
                      <next>
                        <block type=\"SaltarAbajo\">
                          <next>
                            <block type=\"MoverDerechaDibujando\">
                              <next>
                                <block type=\"SaltarArriba\"></block>
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
  })
})