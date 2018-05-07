import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.I1b";

moduloActividad(nombre);

actividadTest(nombre, {
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"A|*9%tGgGiIX%!v/PT^7\">
          <value name=\"count\">
            <block type=\"math_number\" id=\"A)Np+o{I=:uU[AVqmbte\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"^LGb}9Z#IsyCg;haF05n\">
              <next>
                <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"qkqTBU1ZmkhL1zbYF\`H\`\">
                  <field name=\"texto\">x</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
});
