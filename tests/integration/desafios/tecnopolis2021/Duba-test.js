import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Tecnopolis 2021 - Con Duba", () => {

  actividadTest("tecnopolis2021Modelo", {
    descripcionAdicional: "tecnopolis2021Modelo: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaDerecha\">
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"MoverACasillaDerecha\">
                  <next>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"ComerChurrasco\"></block>
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
  actividadTest("tecnopolis2021DubaNivel1", {
    descripcionAdicional: "tecnopolis2021DubaNivel1: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">5</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\"></block>
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
                <block type=\"MoverACasillaAbajo\"></block>
              </statement>
              <next>
                <block type=\"ComerChurrasco\">
                  <next>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"ComerChurrasco\"></block>
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
  actividadTest("tecnopolis2021DubaNivel2", {
    descripcionAdicional: "tecnopolis2021DubaNivel2: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">5</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"MoverACasillaAbajo\"></block>
              </next>
            </block>
          </statement>
          <next>
            <block type=\"ComerChurrasco\"></block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021DubaNivel3", {
    descripcionAdicional: "tecnopolis2021DubaNivel3: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"repetir\">
          <value name=\"count\">
            <shadow type=\"required_value\"></shadow>
            <block type=\"math_number\">
              <field name=\"NUM\">5</field>
            </block>
          </value>
          <statement name=\"block\">
            <shadow type=\"required_statement\"></shadow>
            <block type=\"MoverACasillaDerecha\"></block>
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
                <block type=\"MoverACasillaAbajo\"></block>
              </statement>
              <next>
                <block type=\"MoverACasillaIzquierda\">
                  <next>
                    <block type=\"MoverACasillaIzquierda\">
                      <next>
                        <block type=\"MoverACasillaAbajo\">
                          <next>
                            <block type=\"MoverACasillaAbajo\">
                              <next>
                                <block type=\"MoverACasillaDerecha\">
                                  <next>
                                    <block type=\"MoverACasillaDerecha\">
                                      <next>
                                        <block type=\"ComerChurrasco\"></block>
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
  actividadTest("tecnopolis2021DubaNivel4", {
    descripcionAdicional: "tecnopolis2021DubaNivel4: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
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
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"MoverACasillaAbajo\">
                  <next>
                    <block type=\"ComerChurrasco\"></block>
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