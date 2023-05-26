import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = 'PelotaPaleta';

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
  <xml xmlns="http://www.w3.org/1999/xhtml">
     <block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
           <block type="MoverACasillaDerecha" id="20">
              <next>
                 <block type="SiNo" id="22" inline="true">
                    <value name="condition">
                       <block type="TocandoPelotaChuy" id="30" />
                    </value>
                    <statement name="block1">
                       <block type="PatearPelota" id="26" />
                    </statement>
                    <statement name="block2">
                       <block type="UsarPaleta" id="34" />
                    </statement>
                 </block>
              </next>
           </block>
        </statement>
     </block>
  </xml>`,
      descripcionAdicional: 'por pelota',
      cantidadDeActoresAlTerminar: {
         "Chuy": 1
      }
   });

});
