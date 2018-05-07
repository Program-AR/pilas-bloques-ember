import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.I1c";

moduloActividad(nombre);

actividadTest(nombre, {
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"=\`!2uFmT)%OBNkt,W=h1\">
          <value name=\"count\">
            <block type=\"math_number\" id=\")t=\`~,E:an(Tus#%m_GZ\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"6^-5XndAQRkx(TLB%YKl\">
              <next>
                <block type=\"EscribirLetraActualEnOtraCuadricula\" id=\":!bE-zPnu1(c=6O6*Ays\">
                  <next>
                    <block type=\"si\" id=\"{oFR|aUP_ZGas]TL0#O-\">
                      <value name=\"condition\">
                        <block type=\"hayVocalRMT\" id=\"(gJIHo6/pol2SElr(hWU\">
                          <field name=\"letra\">m</field>
                        </block>
                      </value>
                      <statement name=\"block\">
                        <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"!69:l%t)\`lAkWGqoV3/L\">
                          <field name=\"texto\">ICH</field>
                        </block>
                      </statement>
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
});
