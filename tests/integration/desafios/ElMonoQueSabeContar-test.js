import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'ElMonoQueSabeContar';

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="Repetir" id="68" inline="true">
            <value name="count">
               <block type="math_number" id="69">
                  <field name="NUM">4</field>
               </block>
            </value>
            <statement name="block">
               <block type="procedures_callnoreturn" id="81">
                  <mutation name="Contar frutas de columna" />
                  <next>
                     <block type="procedures_callnoreturn" id="87">
                        <mutation name="Volver al inicio" />
                        <next>
                           <block type="SiguienteColumna" id="93" />
                        </next>
                     </block>
                  </next>
               </block>
            </statement>
            <next>
               <block type="procedures_callnoreturn" id="108">
                  <mutation name="Contar frutas de columna" />
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="53" x="277" y="15">
      <mutation />
      <field name="NAME">Contar frutas de columna</field>
      <statement name="STACK">
         <block type="hasta" id="114" inline="true">
            <value name="condition">
               <block type="EstoySobreElFinal" id="129" />
            </value>
            <statement name="block">
               <block type="MoverACasillaAbajo" id="146">
                  <next>
                     <block type="procedures_callnoreturn" id="163">
                        <mutation name="Contar banana si hay" />
                        <next>
                           <block type="procedures_callnoreturn" id="157">
                              <mutation name="Contar manzana si hay" />
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="49" x="13" y="211">
      <mutation />
      <field name="NAME">Contar banana si hay</field>
      <statement name="STACK">
         <block type="si" id="202" inline="true">
            <value name="condition">
               <block type="TocandoBanana" id="217" />
            </value>
            <statement name="block">
               <block type="ContarBanana" id="228" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="46" x="411" y="227">
      <mutation />
      <field name="NAME">Contar manzana si hay</field>
      <statement name="STACK">
         <block type="si" id="240" inline="true">
            <value name="condition">
               <block type="TocandoManzana" id="222" />
            </value>
            <statement name="block">
               <block type="ContarManzana" id="234" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="58" x="154" y="312">
      <mutation />
      <field name="NAME">Volver al inicio</field>
      <statement name="STACK">
         <block type="hasta" id="251" inline="true">
            <value name="condition">
               <block type="EstoySobreElInicio" id="256" />
            </value>
            <statement name="block">
               <block type="MoverACasillaArriba" id="262" />
            </statement>
         </block>
      </statement>
   </block>
</xml>`,
   });


});