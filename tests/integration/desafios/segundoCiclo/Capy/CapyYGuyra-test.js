import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "1001";

moduloActividad(nombre, () => {

  actividadTest(nombre, {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="SubirPajarito"></block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`}
  )
}); 