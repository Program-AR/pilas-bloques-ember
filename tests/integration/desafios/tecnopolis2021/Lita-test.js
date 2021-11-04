import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Tecnopolis 2021 - Con Lita", () => {

  actividadTest("tecnopolis2021LitaNivel1", {
    descripcionAdicional: "tecnopolis2021LitaNivel1: Se puede resolver",
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
            <block type=\"MoverACasillaAbajo\"></block>
          </statement>
          <next>
            <block type=\"AgarrarLechuga\">
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
                    <block type=\"AgarrarTomate\">
                      <next>
                        <block type=\"MoverACasillaArriba\">
                          <next>
                            <block type=\"PrepararEnsalada\"></block>
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
  });

  actividadTest("tecnopolis2021LitaNivel2", {
    descripcionAdicional: "tecnopolis2021LitaNivel2: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
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
                    <block type=\"AgarrarLechuga\">
                      <next>
                        <block type=\"MoverACasillaAbajo\">
                          <next>
                            <block type=\"AgarrarTomate\"></block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type=\"MoverACasillaDerecha\">
                  <next>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"PrepararEnsalada\"></block>
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

  actividadTest("tecnopolis2021LitaNivel3", {
    descripcionAdicional: "tecnopolis2021LitaNivel3: Se puede resolver",
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
            <block type=\"AgarrarTomate\">
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
                    <block type=\"AgarrarLechuga\">
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
                                                <block type=\"PrepararEnsalada\"></block>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  })
  actividadTest("tecnopolis2021LitaNivel4", {
    descripcionAdicional: "tecnopolis2021LitaNivel4: Se puede resolver",
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
                <block type=\"AgarrarLechuga\">
                  <next>
                    <block type=\"MoverACasillaAbajo\">
                      <next>
                        <block type=\"AgarrarTomate\"></block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"MoverACasillaAbajo\">
                  <next>
                    <block type=\"PrepararEnsalada\"></block>
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
  actividadTest("tecnopolis2021LitaNivel5", {
    descripcionAdicional: "tecnopolis2021LitaNivel5: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"228\" y=\"15\">
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
                <block type=\"AgarrarTomate\"></block>
              </next>
            </block>
          </statement>
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
                    <block type=\"AgarrarLechuga\"></block>
                  </next>
                </block>
              </statement>
              <next>
                <block type=\"MoverACasillaIzquierda\">
                  <next>
                    <block type=\"MoverACasillaIzquierda\">
                      <next>
                        <block type=\"PrepararEnsalada\"></block>
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
  actividadTest("tecnopolis2021LitaNivel6", {
    descripcionAdicional: "tecnopolis2021LitaNivel6: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"228\" y=\"15\">
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
                    <block type=\"AgarrarLechuga\">
                      <next>
                        <block type=\"MoverACasillaAbajo\"></block>
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
                                <block type=\"AgarrarTomate\">
                                  <next>
                                    <block type=\"MoverACasillaArriba\"></block>
                                  </next>
                                </block>
                              </statement>
                              <next>
                                <block type=\"MoverACasillaDerecha\">
                                  <next>
                                    <block type=\"PrepararEnsalada\"></block>
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
  actividadTest("tecnopolis2021LitaNivel7", {
    descripcionAdicional: "tecnopolis2021LitaNivel7: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"228\" y=\"15\">
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
                <block type=\"AgarrarLechuga\"></block>
              </next>
            </block>
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
                    <block type=\"AgarrarTomate\">
                      <next>
                        <block type=\"MoverACasillaIzquierda\"></block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type=\"MoverACasillaArriba\">
                      <next>
                        <block type=\"PrepararEnsalada\"></block>
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
  actividadTest("tecnopolis2021LitaNivel8", {
    descripcionAdicional: "tecnopolis2021LitaNivel8: Se puede resolver",
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <variables></variables>
    <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"228\" y=\"15\">
      <statement name=\"program\">
        <shadow type=\"required_statement\"></shadow>
        <block type=\"MoverACasillaDerecha\">
          <next>
            <block type=\"MoverACasillaDerecha\">
              <next>
                <block type=\"AgarrarLechuga\">
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
                                <block type=\"AgarrarTomate\">
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
                                        <block type=\"PrepararEnsalada\"></block>
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
})
