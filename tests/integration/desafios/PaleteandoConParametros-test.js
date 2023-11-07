import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'PaleteandoConParametros';

moduloActividad(nombre, () => {
   actividadTest(nombre, {
      solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="+{hSDvtz9!|q0kc_#:UB">direccion</variable></variables><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><shadow type="required_statement" id="@=iQ+%aR.RXA0Y6lR8k/"></shadow><block type="procedures_callnoreturn" id="3"><mutation name="Avanzar paleteando hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaLaDerecha" id="47"></block></value><next><block type="procedures_callnoreturn" id="4"><mutation name="Avanzar paleteando hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaAbajo" id="65"></block></value><next><block type="procedures_callnoreturn" id="5"><mutation name="Avanzar paleteando hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaLaIzquierda" id="53"></block></value><next><block type="procedures_callnoreturn" id="6"><mutation name="Avanzar paleteando hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaArriba" id="77"></block></value></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="13" x="333" y="183"><field name="NAME">Paletear si hay Pelota</field><statement name="STACK"><block type="si" id="14"><value name="condition"><shadow type="required_value" id="|pQ9u`C~XmF/r,v|nb*n"></shadow><block type="TocandoPingPong" id=":.z.uZt]^~-~Eew4nqIn"></block></value><statement name="block"><shadow type="required_statement" id="}$rAhm`4MKvzbZqa#j/?"></shadow><block type="RebotarPingPong" id="-YCY!iSi{/[7kfm7LoEv"></block></statement></block></statement></block><block type="procedures_defnoreturn" id="7" x="-2" y="206"><mutation><arg name="direccion"></arg></mutation><field name="NAME">Avanzar paleteando hacia</field><field name="ARG0">direccion</field><statement name="STACK"><block type="Repetir" id="8"><value name="count"><shadow type="required_value" id="4nOnCsb2.T9vVrYv1K?o"></shadow><block type="math_number" id="9"><field name="NUM">4</field></block></value><statement name="block"><shadow type="required_statement" id="[,;kw@E;zoE9|yYoAxob"></shadow><block type="procedures_callnoreturn" id="10"><mutation name="Avanzar hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="param_get" id="11"><mutation var="direccion"></mutation></block></value><next><block type="procedures_callnoreturn" id="12"><mutation name="Paletear si hay Pelota"></mutation></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="17" x="1" y="514"><mutation><arg name="direccion"></arg></mutation><field name="NAME">Avanzar hacia</field><field name="ARG0">direccion</field><statement name="STACK"><block type="si" id="18"><value name="condition"><shadow type="required_value" id="t4=[){:cRECeoLTp,vq}"></shadow><block type="logic_compare" id="19"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="=j}R`3:_PEO0u;@hwxao"></shadow><block type="param_get" id="20"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="V{bgoSMTE1am8(p}m0.f"></shadow><block type="ParaLaDerecha" id="93"></block></value></block></value><statement name="block"><shadow type="required_statement" id="$F2WM,f6%kf[K[zDMI!O"></shadow><block type="MoverACasillaDerecha" id="22"></block></statement><next><block type="si" id="23"><value name="condition"><shadow type="required_value" id=":CrzVY;=N3(_60uhE2@)"></shadow><block type="logic_compare" id="24"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="#wxTU-l~UNJq+{%Xsz5I"></shadow><block type="param_get" id="25"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="HZ_WTfxM]Mg3T_k[`0aE"></shadow><block type="ParaLaIzquierda" id="99"></block></value></block></value><statement name="block"><shadow type="required_statement" id="Bso@oxZfZDgZKz*5%rY{"></shadow><block type="MoverACasillaIzquierda" id="27"></block></statement><next><block type="si" id="28"><value name="condition"><shadow type="required_value" id="Im;=i(ixZ5ZW0Ey#t8r+"></shadow><block type="logic_compare" id="29"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="WHG5=#J=}wu4c{DC47/*"></shadow><block type="param_get" id="30"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="Sif2u}!Wqi%}5Y2((YJi"></shadow><block type="ParaArriba" id="105"></block></value></block></value><statement name="block"><shadow type="required_statement" id="+r}*U^aO(K$8N]pTnkw?"></shadow><block type="MoverACasillaArriba" id="32"></block></statement><next><block type="si" id="33"><value name="condition"><shadow type="required_value" id="S-$ZuJ%[)CV`{-*/`=p9"></shadow><block type="logic_compare" id="34"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="B/83V^Lr8-Vt2AaP4TEk"></shadow><block type="param_get" id="35"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="P.r,#QzJ=ftUc}l(vo2Z"></shadow><block type="ParaAbajo" id="111"></block></value></block></value><statement name="block"><shadow type="required_statement" id="8k_.Q/Si~{-ya:p$I-*z"></shadow><block type="MoverACasillaAbajo" id="37"></block></statement></block></next></block></next></block></next></block></statement></block></xml>',
   });

   actividadTest(nombre, {
      descripcionAdicional: 'Da error al querer avanzar hacia la izquierda si no hay camino',
      solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="+{hSDvtz9!|q0kc_#:UB">direccion</variable></variables><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><shadow type="required_statement" id="fdDyD*YB8qviVEH{g?B*"></shadow><block type="procedures_callnoreturn" id="5"><mutation name="AvanzarPaleteandoHacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaLaIzquierda" id="53"></block></value><next><block type="procedures_callnoreturn" id="6"><mutation name="AvanzarPaleteandoHacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaArriba" id="77"></block></value><next><block type="procedures_callnoreturn" id="3"><mutation name="AvanzarPaleteandoHacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaLaDerecha" id="47"></block></value><next><block type="procedures_callnoreturn" id="4"><mutation name="AvanzarPaleteandoHacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="ParaAbajo" id="65"></block></value></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="13" x="333" y="183"><field name="NAME">PaletearSiHayPelota</field><statement name="STACK"><block type="si" id="14"><value name="condition"><shadow type="required_value" id="%-wc7t*sLxYG9B(Pdw/|"></shadow><block type="TocandoPingPong" id=":.z.uZt]^~-~Eew4nqIn"></block></value><statement name="block"><shadow type="required_statement" id="^V9K0:U!07ji4zhtfn/."></shadow><block type="RebotarPingPong" id="-YCY!iSi{/[7kfm7LoEv"></block></statement></block></statement></block><block type="procedures_defnoreturn" id="7" x="-2" y="206"><mutation><arg name="direccion"></arg></mutation><field name="NAME">AvanzarPaleteandoHacia</field><field name="ARG0">direccion</field><statement name="STACK"><block type="Repetir" id="8"><value name="count"><shadow type="required_value" id="@~@g=^lTuv;@k[InV_!;"></shadow><block type="math_number" id="9"><field name="NUM">4</field></block></value><statement name="block"><shadow type="required_statement" id="W^J9*mb2nEHT)3w}WYuH"></shadow><block type="procedures_callnoreturn" id="10"><mutation name="Avanzar hacia"><arg name="direccion"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="param_get" id="11"><mutation var="direccion"></mutation></block></value><next><block type="procedures_callnoreturn" id="12"><mutation name="PaletearSiHayPelota"></mutation></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="17" x="1" y="514"><mutation><arg name="direccion"></arg></mutation><field name="NAME">Avanzar hacia</field><field name="ARG0">direccion</field><statement name="STACK"><block type="si" id="18"><value name="condition"><shadow type="required_value" id="P!Q9?++[iGFQp_Nj,BUt"></shadow><block type="logic_compare" id="19"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="}Vne_cn*/hLsF}2*1!V3"></shadow><block type="param_get" id="20"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="tOi!13DlS)A9AyP%``{D"></shadow><block type="ParaLaDerecha" id="93"></block></value></block></value><statement name="block"><shadow type="required_statement" id="i3?$iI)3{?ar#k`AJ3[N"></shadow><block type="MoverACasillaDerecha" id="22"></block></statement><next><block type="si" id="23"><value name="condition"><shadow type="required_value" id="]n+/:!aIc6xFJWdss#^s"></shadow><block type="logic_compare" id="24"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="03!3sM/~Z|EPoK%@CALL"></shadow><block type="param_get" id="25"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="Uh/iay5ljdU[6mzZH7{U"></shadow><block type="ParaLaIzquierda" id="99"></block></value></block></value><statement name="block"><shadow type="required_statement" id="=Rn[2M/i^ZJAeJ61lw{t"></shadow><block type="MoverACasillaIzquierda" id="27"></block></statement><next><block type="si" id="28"><value name="condition"><shadow type="required_value" id=".aE02Q@EFqdN4VyRl{MH"></shadow><block type="logic_compare" id="29"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="g1)hv;Sgyk`j^]S7eXqX"></shadow><block type="param_get" id="30"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="PUT)ps_W|8,4GJy4lP=u"></shadow><block type="ParaArriba" id="105"></block></value></block></value><statement name="block"><shadow type="required_statement" id="lfI;t1#M{iqDjFO=Z)i0"></shadow><block type="MoverACasillaArriba" id="32"></block></statement><next><block type="si" id="33"><value name="condition"><shadow type="required_value" id="GnhcJ$I7ao$;Evyd`:8K"></shadow><block type="logic_compare" id="34"><field name="OP">EQ</field><value name="A"><shadow type="required_value" id="Hb5habMz5zI|A73],jLh"></shadow><block type="param_get" id="35"><mutation var="direccion"></mutation></block></value><value name="B"><shadow type="required_value" id="I9sL7YR|)y;Z!tBO7cV3"></shadow><block type="ParaAbajo" id="111"></block></value></block></value><statement name="block"><shadow type="required_statement" id="qG[J*?N0d;tvCi=WuLkM"></shadow><block type="MoverACasillaAbajo" id="37"></block></statement></block></next></block></next></block></next></block></statement></block></xml>',
      errorEsperado: 'No puedo ir para la izquierda',
   });

});