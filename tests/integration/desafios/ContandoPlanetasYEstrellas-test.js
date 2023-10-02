import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'ContandoPlanetasYEstrellas';

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
                  <mutation name="Contar astros de columna" />
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
                  <mutation name="Contar astros de columna" />
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="53" x="277" y="15">
      <mutation />
      <field name="NAME">Contar astros de columna</field>
      <statement name="STACK">
         <block type="hasta" id="114" inline="true">
            <value name="condition">
               <block type="EstoySobreElFinalManic" id="129" />
            </value>
            <statement name="block">
               <block type="MoverACasillaAbajo" id="146">
                  <next>
                     <block type="procedures_callnoreturn" id="163">
                        <mutation name="Contar estrella si hay" />
                        <next>
                           <block type="procedures_callnoreturn" id="157">
                              <mutation name="Contar planeta si hay" />
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
      <field name="NAME">Contar estrella si hay</field>
      <statement name="STACK">
         <block type="si" id="202" inline="true">
            <value name="condition">
               <block type="TocandoEstrellaManic" id="217" />
            </value>
            <statement name="block">
               <block type="ContarEstrella" id="228" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="46" x="411" y="227">
      <mutation />
      <field name="NAME">Contar planeta si hay</field>
      <statement name="STACK">
         <block type="si" id="240" inline="true">
            <value name="condition">
               <block type="TocandoPlaneta" id="222" />
            </value>
            <statement name="block">
               <block type="ContarPlaneta" id="234" />
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
               <block type="EstoySobreElInicioManic" id="256" />
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