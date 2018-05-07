import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("2.I1");

actividadTest("2.I1a", {
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
	solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
	<block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
	  <statement name=\"program\">
		<block type=\"MoverLeyendoDerecha\">
		  <next>
			<block type=\"MoverLeyendoDerecha\">
			  <next>
				<block type=\"MoverLeyendoDerecha\">
				  <next>
					<block type=\"MoverLeyendoAbajo\">
					  <next>
						<block type=\"MoverLeyendoIzquierda\">
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

