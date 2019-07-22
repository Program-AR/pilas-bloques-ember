import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ElDetectiveChaparro";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
  <xml xmlns="http://www.w3.org/1999/xhtml">
     <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
           <block type="IrAlPrimerSospechoso" id="3">
              <next>
                 <block type="InterrogarSospechoso" id="8">
                    <next>
                       <block type="Hasta" id="4" inline="true">
                          <value name="condition">
                             <block type="EsCulpable" id="5" />
                          </value>
                          <statement name="block">
                             <block type="IrAlSiguienteSospechoso" id="7">
                                <next>
                                   <block type="InterrogarSospechoso" id="6" />
                                </next>
                             </block>
                          </statement>
                       </block>
                    </next>
                 </block>
              </next>
           </block>
        </statement>
     </block>
  </xml>`,
   });

   actividadTest(nombre, {
      descripcionAdicional: 'Da error si se quiere determinar si un sospechoso es culpable antes de interrogarlo',
      errorEsperado: 'No puedo saber si es el culpable, no lo he interrogado antes.',
      solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
    <statement name="program">
      <block type="IrAlPrimerSospechoso" id="JguD~YdHru6P~fcr%NY">
        <next>
          <block type="Hasta" id="eEne^.+K8A^2IFdubL?v">
            <value name="condition">
              <block type="EsCulpable" id="]RG,CNdY/tAwH5c5-Fa"></block>
            </value>
            <statement name="block">
              <block type="IrAlSiguienteSospechoso" id="zxo0AF]?Z!i,9bbiRJ+[">
                <next>
                  <block type="InterrogarSospechoso" id="Ed*!GNd4vswjF7HVjWL2"></block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="Repetir" id="hX[/K9]kVi:cxT;yI{bB" disabled="true" x="-20" y="480"></block>
</xml>`
   });

});