import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.I1a";

moduloActividad(nombre);

actividadTest(nombre, {
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"W/=#q%TdW3T9g|?6uW?U\">
          <value name=\"count\">
            <block type=\"math_number\" id=\"H$bkq5pKO5:\`tv}7!DEx\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"6o$rpc;m$\`T.hXx?v:JA\">
              <next>
                <block type=\"EscribirLetraActualEnOtraCuadricula\" id=\"?z6L8/qSbr{QpJk/$VYd\"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
});
