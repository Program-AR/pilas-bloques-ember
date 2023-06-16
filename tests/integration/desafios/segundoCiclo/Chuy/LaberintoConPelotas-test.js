import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = 'LaberintoConPelotas';

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="hasta" id="51" inline="true">
            <value name="condition">
               <block type="TocandoFinCamino" id="61" />
            </value>
            <statement name="block">
               <block type="si" id="74" inline="true">
                  <value name="condition">
                     <block type="TocandoPulpito" id="79" />
                  </value>
                  <statement name="block">
                     <block type="PatearPulpito" id="92" />
                  </statement>
                  <next>
                     <block type="SiNo" id="14" inline="true">
                        <value name="condition">
                           <block type="PuedeMoverAbajo" id="26" />
                        </value>
                        <statement name="block1">
                           <block type="MoverACasillaAbajo" id="30" />
                        </statement>
                        <statement name="block2">
                           <block type="MoverACasillaDerecha" id="38" />
                        </statement>
                     </block>
                  </next>
               </block>
            </statement>
         </block>
      </statement>
   </block>
</xml>`,
   });

});
