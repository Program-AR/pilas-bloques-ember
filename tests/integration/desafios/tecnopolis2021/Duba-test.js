import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Tecnopolis 2021 - Con Duba", () => {

  actividadTest("tecnopolis2021ModeloRepeticion", {
    descripcionAdicional: "tecnopolis2021Modelo: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <variables></variables>
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"273\" y=\"15\">
    <statement name=\"program\">
      <shadow type=\"required_statement\"></shadow>
      <block type=\"repetir\">
        <value name=\"count\">
          <shadow type=\"required_value\"></shadow>
          <block type=\"math_number\">
            <field name=\"NUM\">2</field>
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
  actividadTest("tecnopolis2021DubaNivel5", {
    descripcionAdicional: "tecnopolis2021DubaNivel5: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
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
            <block type=\"ComerChurrasco\">
              <next>
                <block type=\"repetir\">
                  <value name=\"count\">
                    <shadow type=\"required_value\"></shadow>
                    <block type=\"math_number\">
                      <field name=\"NUM\">5</field>
                    </block>
                  </value>
                  <statement name=\"block\">
                    <shadow type=\"required_statement\"></shadow>
                    <block type=\"MoverACasillaAbajo\"></block>
                  </statement>
                  <next>
                    <block type=\"ComerChurrasco\"></block>
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
  actividadTest("tecnopolis2021DubaNivel6", {
    descripcionAdicional: "tecnopolis2021DubaNivel6: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaDerecha\">
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"repetir\">
                  <value name=\"count\">
                    <shadow type=\"required_value\"></shadow>
                    <block type=\"math_number\">
                      <field name=\"NUM\">5</field>
                    </block>
                  </value>
                  <statement name=\"block\">
                    <shadow type=\"required_statement\"></shadow>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"ComerChurrasco\"></block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type=\"MoverACasillaDerecha\">
                      <next>
                        <block type=\"MoverACasillaDerecha\">
                          <next>
                            <block type=\"repetir\">
                              <value name=\"count\">
                                <shadow type=\"required_value\"></shadow>
                                <block type=\"math_number\">
                                  <field name=\"NUM\">5</field>
                                </block>
                              </value>
                              <statement name=\"block\">
                                <shadow type=\"required_statement\"></shadow>
                                <block type=\"ComerChurrasco\">
                                  <next>
                                    <block type=\"MoverACasillaArriba\"></block>
                                  </next>
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
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021DubaNivel7", {
    descripcionAdicional: "tecnopolis2021DubaNivel7: Se puede resolver",
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
                <block type=\"repetir\">
                  <value name=\"count\">
                    <shadow type=\"required_value\"></shadow>
                    <block type=\"math_number\">
                      <field name=\"NUM\">2</field>
                    </block>
                  </value>
                  <statement name=\"block\">
                    <shadow type=\"required_statement\"></shadow>
                    <block type=\"MoverACasillaIzquierda\"></block>
                  </statement>
                  <next>
                    <block type=\"MoverACasillaArriba\">
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
  actividadTest("tecnopolis2021DubaNivel8", {
    descripcionAdicional: "tecnopolis2021DubaNivel8: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"269\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaDerecha\">
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"repetir\">
                  <value name=\"count\">
                    <shadow type=\"required_value\"></shadow>
                    <block type=\"math_number\">
                      <field name=\"NUM\">5</field>
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
                            <block type=\"ComerChurrasco\">
                              <next>
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
      </statement>
    </block>
  </xml>`
  })
})