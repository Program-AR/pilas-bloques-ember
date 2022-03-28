import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Tecnopolis 2021 - Con Toto", () => {
  actividadTest("tecnopolis2021TotoNivel5", {
    descripcionAdicional: 'tecnopolis2021TotoNivel5: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverLeyendoDerecha\">
          <next>
            <block type=\"MoverLeyendoDerecha\">
              <next>
                <block type=\"MoverLeyendoAbajo\">
                  <next>
                    <block type=\"MoverLeyendoDerecha\">
                      <next>
                        <block type=\"MoverLeyendoAbajo\">
                          <next>
                            <block type=\"MoverLeyendoIzquierda\">
                              <next>
                                <block type=\"MoverLeyendoIzquierda\">
                                  <next>
                                    <block type=\"MoverLeyendoIzquierda\">
                                      <next>
                                        <block type=\"MoverLeyendoArriba\">
                                          <next>
                                            <block type=\"MoverLeyendoDerecha\"></block>
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
  actividadTest("tecnopolis2021TotoNivel6", {
    descripcionAdicional: 'tecnopolis2021TotoNivel6: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverLeyendoAbajo\"></block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021TotoNivel7", {
    descripcionAdicional: 'tecnopolis2021TotoNivel7: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">4</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverLeyendoAbajo\"></block>
          </statement>
          <next>
            <block type=\"repetir\">
              <value name=\"count\">
                <shadow type=\"required_value\"></shadow>
                <block type=\"math_number\">
                  <field name=\"NUM\">3</field>
                </block>
              </value>
              <statement name=\"block\">
                <shadow type=\"required_statement\"></shadow>
                <block type=\"MoverLeyendoArriba\"></block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021TotoNivel8", {
    descripcionAdicional: 'tecnopolis2021TotoNivel8: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">8</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverLeyendoDerecha\"></block>
          </statement>
          <next>
            <block type=\"MoverLeyendoAbajo\"></block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021TotoNivel9", {
    descripcionAdicional: 'tecnopolis2021TotoNivel9: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
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
            <block type=\"MoverLeyendoDerecha\">
              <next>
                <block type=\"MoverLeyendoArriba\"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  })
})