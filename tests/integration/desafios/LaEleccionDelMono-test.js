import { moduloActividad, actividadTest } from '../../helpers/actividadTest';


const nombre = 'LaEleccionDelMono';

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
  <xml xmlns="http://www.w3.org/1999/xhtml">
     <block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
           <block type="AvanzarMono" id="20">
              <next>
                 <block type="SiNo" id="22" inline="true">
                    <value name="condition">
                       <block type="TocandoManzana" id="30" />
                    </value>
                    <statement name="block1">
                       <block type="ComerManzana" id="26" />
                    </statement>
                    <statement name="block2">
                       <block type="ComerBanana" id="34" />
                    </statement>
                 </block>
              </next>
           </block>
        </statement>
     </block>
  </xml>`,
      descripcionAdicional: 'por Banana',
      cantidadDeActoresAlTerminar: {
         "MonoAnimado": 1
      }
   });

});
