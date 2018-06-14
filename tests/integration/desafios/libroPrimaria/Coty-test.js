import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Coty");

actividadTest("2.1.3a", {
  descripcionAdicional: 'Coty-2.1.3a',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverDerechaDibujando\">
        <next>
          <block type=\"MoverArribaDibujando\">
            <next>
              <block type=\"MoverDerechaDibujando\">
                <next>
                  <block type=\"MoverAbajoDibujando\"></block>
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

actividadTest("2.1.3b", {
  descripcionAdicional: 'Coty-2.1.3b',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverDerechaDibujando\">
        <next>
          <block type=\"MoverDerechaDibujando\">
            <next>
              <block type=\"MoverAbajoDibujando\">
                <next>
                  <block type=\"MoverAbajoDibujando\">
                    <next>
                      <block type=\"MoverIzquierdaDibujando\">
                        <next>
                          <block type=\"MoverIzquierdaDibujando\">
                            <next>
                              <block type=\"MoverArribaDibujando\">
                                <next>
                                  <block type=\"MoverArribaDibujando\"></block>
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
</xml>`,
});

actividadTest("2.1.3c", {
  descripcionAdicional: 'Coty-2.1.3c',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverIzquierdaDibujando">
        <next>
          <block type="SaltarIzquierda">
            <next>
              <block type="MoverIzquierdaDibujando">
                <next>
                  <block type="SaltarIzquierda">
                    <next>
                      <block type="MoverIzquierdaDibujando">
                        <next>
                          <block type="SaltarIzquierda"></block>
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
</xml>`,
});

actividadTest("2.1.3d", {
  descripcionAdicional: 'Coty-2.1.3d',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"SaltarDerecha\">
        <next>
          <block type=\"MoverArribaDibujando\">
            <next>
              <block type=\"MoverDerechaDibujando\">
                <next>
                  <block type=\"MoverAbajoDibujando\">
                    <next>
                      <block type=\"MoverIzquierdaDibujando\"></block>
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
</xml>`,
});

actividadTest("2.1.3e", {
  descripcionAdicional: 'Coty-2.1.3e',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="SaltarAbajo">
        <next>
          <block type="MoverAbajoDibujando">
            <next>
              <block type="MoverDerechaDibujando">
                <next>
                  <block type="MoverDerechaDibujando">
                    <next>
                      <block type="MoverArribaDibujando">
                        <next>
                          <block type="MoverIzquierdaDibujando">
                            <next>
                              <block type="MoverIzquierdaDibujando"></block>
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
</xml>`,
});

actividadTest("2.1.3f", {
  descripcionAdicional: 'Coty-2.1.3f',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="SaltarIzquierda">
        <next>
          <block type="MoverAbajoDibujando">
            <next>
              <block type="MoverAbajoDibujando">
                <next>
                  <block type="SaltarDerecha">
                    <next>
                      <block type="SaltarDerecha">
                        <next>
                          <block type="MoverArribaDibujando">
                            <next>
                              <block type="MoverArribaDibujando"></block>
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
</xml>`,
});

actividadTest("2.1.3g", {
  descripcionAdicional: 'Coty-2.1.3g',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverArribaDibujando">
          <next>
            <block type="SaltarArriba">
              <next>
                <block type="MoverDerechaDibujando">
                  <next>
                    <block type="MoverDerechaDibujando">
                      <next>
                        <block type="MoverDerechaDibujando">
                          <next>
                            <block type="SaltarArriba">
                              <next>
                                <block type="SaltarArriba">
                                  <next>
                                    <block type="MoverArribaDibujando">
                                      <next>
                                        <block type="MoverDerechaDibujando"></block>
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
  </xml>`,
});

actividadTest("3.1.4a", {
  descripcionAdicional: 'Coty-3.1.4a',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"repetir\">
        <value name=\"count\">
          <block type=\"math_number\">
            <field name=\"NUM\">4</field>
          </block>
        </value>
        <statement name=\"block\">
          <block type=\"MoverDerechaDibujando\">
            <next>
              <block type=\"SaltarDerecha\"></block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
});

actividadTest("3.1.4b", {
  descripcionAdicional: 'Coty-3.1.4b',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverDerechaDibujando">
        <next>
          <block type="SaltarDerecha">
            <next>
              <block type="MoverDerechaDibujando">
                <next>
                  <block type="SaltarDerecha">
                    <next>
                      <block type="MoverDerechaDibujando">
                        <next>
                          <block type="SaltarDerecha">
                            <next>
                              <block type="MoverDerechaDibujando">
                                <next>
                                  <block type="MoverAbajoDibujando"></block>
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
</xml>`,
});

actividadTest("3.1.4c", {
  descripcionAdicional: 'Coty-3.1.4c',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">3</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverArribaDibujando">
            <next>
              <block type="MoverDerechaDibujando">
                <next>
                  <block type="MoverDerechaDibujando"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
});

actividadTest("3.2.3c", {
  descripcionAdicional: 'Coty-3.2.3c',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">4</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverArribaDibujando">
            <next>
              <block type="MoverDerechaDibujando"></block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
});

actividadTest("3.2.3d", {
  descripcionAdicional: 'Coty-3.2.3d',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">3</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverArribaDibujando">
            <next>
              <block type="MoverDerechaDibujando"></block>
            </next>
          </block>
        </statement>
        <next>
          <block type="repetir">
            <value name="count">
              <block type="math_number">
                <field name="NUM">3</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverDerechaDibujando">
                <next>
                  <block type="MoverAbajoDibujando"></block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});

actividadTest("4.1.3c", {
  descripcionAdicional: 'Coty-4.1.3c',
	solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="si">
        <value name="condition">
          <block type="HayCharco"></block>
        </value>
        <statement name="block">
          <block type="SaltarDerecha"></block>
        </statement>
        <next>
          <block type="MoverDerechaDibujando">
            <next>
              <block type="MoverAbajoDibujando">
                <next>
                  <block type="MoverIzquierdaDibujando">
                    <next>
                      <block type="MoverArribaDibujando"></block>
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
</xml>`,
});