import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("DesafiosCoty");

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
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"repetir\">
        <value name=\"count\">
          <block type=\"math_number\">
            <field name=\"NUM\">3</field>
          </block>
        </value>
        <statement name=\"block\">
          <block type=\"MoverIzquierdaDibujando\">
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
	solucion: ``,
});

actividadTest("2.1.3f", {
  descripcionAdicional: 'Coty-2.1.3f',
	solucion: ``,
});

actividadTest("2.1.3g", {
  descripcionAdicional: 'Coty-2.1.3g',
	solucion: ``,
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
        <next>
          <block type=\"MoverAbajoDibujando\">
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
});

actividadTest("3.1.4c", {
  descripcionAdicional: 'Coty-3.1.4c',
	solucion: ``,
});

actividadTest("3.1.4d", {
  descripcionAdicional: 'Coty-3.1.4d',
	solucion: ``,
});

actividadTest("3.1.4e", {
  descripcionAdicional: 'Coty-3.1.4e',
	solucion: ``,
});

actividadTest("4.1.3b", {
  descripcionAdicional: 'Coty-4.1.3b',
	solucion: ``,
});