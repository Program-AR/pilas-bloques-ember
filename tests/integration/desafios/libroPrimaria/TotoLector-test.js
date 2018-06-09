import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Toto lector");

actividadTest("2.I1a", {
  descripcionAdicional: '2.I1a: Se puede resolver',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverLeyendoAbajo\">
        <next>
          <block type=\"MoverLeyendoDerecha\">
            <next>
              <block type=\"MoverLeyendoAbajo\">
                <next>
                  <block type=\"MoverLeyendoDerecha\"></block>
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

actividadTest("2.I1b", {
  descripcionAdicional: '2.I1b: Se puede resolver',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverLeyendoAbajo\">
        <next>
          <block type=\"MoverLeyendoDerecha\">
            <next>
              <block type=\"MoverLeyendoArriba\">
                <next>
                  <block type=\"MoverLeyendoDerecha\">
                    <next>
                      <block type=\"MoverLeyendoArriba\"></block>
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


actividadTest("2.I1c", {
  descripcionAdicional: '2.I1c: Se puede resolver',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverLeyendoAbajo\">
        <next>
          <block type=\"MoverLeyendoIzquierda\">
            <next>
              <block type=\"MoverLeyendoArriba\">
                <next>
                  <block type=\"MoverLeyendoIzquierda\"></block>
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

actividadTest("2.I1d", {
  descripcionAdicional: '2.I1d: Se puede resolver',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
	<block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
	  <statement name=\"program\">
		<block type=\"MoverLeyendoDerecha\">
		  <next>
			<block type=\"MoverLeyendoDerecha\">
			  <next>
				<block type=\"MoverLeyendoDerecha\">
				  <next>
					<block type=\"MoverLeyendoIzquierda\">
					  <next>
						<block type=\"MoverLeyendoAbajo\">
						  <next>
							<block type=\"MoverLeyendoIzquierda\">
							  <next>
								<block type=\"MoverLeyendoIzquierda\"></block>
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

actividadTest("2.I1e", {
  descripcionAdicional: '2.I1e: Se puede resolver',
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"MoverLeyendoIzquierda\">
        <next>
          <block type=\"MoverLeyendoArriba\">
            <next>
              <block type=\"MoverLeyendoDerecha\">
                <next>
                  <block type=\"MoverLeyendoDerecha\">
                    <next>
                      <block type=\"MoverLeyendoAbajo\"></block>
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

