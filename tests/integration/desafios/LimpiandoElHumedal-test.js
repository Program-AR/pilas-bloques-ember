import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'LimpiandoElHumedal';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="x}aq2v[Cc@_!E80`zq@R" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="5]msOqh5ue$NMMxGp!YD"></shadow><block type="repetir" id="*ClAE=u:FG40sD3eM+;t"><value name="count"><shadow type="required_value" id="23f6S49y!D`?xN#TO84."></shadow><block type="math_number" id="3tfiU^Z#*OP#n|2zh`!F"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="3hdn@)6;S0`+rY}@@`!K"></shadow><block type="procedures_callnoreturn" id="};E$I?F7t#.Y|NyS==Bd"><mutation name="agarrarLata"></mutation></block></statement><next><block type="repetir" id=",OLIClN$7I/9MuePNZ,G"><value name="count"><shadow type="required_value" id="t3,qFf$R7W#++FGVoKZ}"></shadow><block type="math_number" id="]qxqwudP5Go#(}7u[@+2"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="^~Ez{o0*#pQVAENQ`~as"></shadow><block type="procedures_callnoreturn" id="pP3gT%5dtKZG3JYN{1+#"><mutation name="AgarrarPapel"></mutation></block></statement><next><block type="MoverACasillaDerecha" id="hJFrjAz95Oc0VM-snks,"><next><block type="MoverACasillaDerecha" id="cnlU#fD,uiTeMmxMfg[["><next><block type="IrseEnYacare" id="pagYh{6TKpfe89Cs9c!R"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="9-pt,n/sVJ(HQ8MT[fq~" x="217" y="94"><field name="NAME">AgarrarPapel</field><statement name="STACK"><block type="repetir" id="z/x;kotLEPX^J^45Ta0L"><value name="count"><shadow type="required_value" id="*I.2Tcai!`dO]Zp+ZTd}"></shadow><block type="math_number" id="gByR2CFU^wt:[an(?g9="><field name="NUM">4</field></block></value><statement name="block"><shadow type="required_statement" id="c_}Gk~Bnr[(}:ScgJ()x"></shadow><block type="MoverACasillaDerecha" id="{CUaAP(!,^KhV*4X:@e."></block></statement><next><block type="repetir" id="$o91k,^2nH,_TT$w8FS}"><value name="count"><shadow type="required_value" id="p)|%bW%C8xaA;[qnWWCR"></shadow><block type="math_number" id="I~@e3H;7$8$y{T[#AH$T"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="XKGo_pif4n+N:OFcp[ak"></shadow><block type="MoverACasillaArriba" id="|fuWb~y$*ym-=PgS8JWM"></block></statement><next><block type="TomarPapel" id="?dB]04%NJ,Ow5+Y9Kpdz"><next><block type="repetir" id="AZp4b$yhKTjhJf)yM./*"><value name="count"><shadow type="required_value" id="J}^)Z+3dEIIY^SKEn~[f"></shadow><block type="math_number" id="S3BE!q)tU+Z.YkHm[z^B"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="WS$}t;.KrnhLs{[;ED|#"></shadow><block type="MoverACasillaAbajo" id="0:iJl9|Q9k,{eu4@~x?m"></block></statement><next><block type="repetir" id="DEjmm~axm6@)|QRy`[52"><value name="count"><shadow type="required_value" id="Ijt+hT~iBI}ZcUzqeY2G"></shadow><block type="math_number" id="INug@v}5`P5BobOg_b?."><field name="NUM">4</field></block></value><statement name="block"><shadow type="required_statement" id="rN%HTmsb16#e80t+|tuH"></shadow><block type="MoverACasillaIzquierda" id="EPtdFN[rdrt!62)p~02-"></block></statement><next><block type="Colocar" id="R60Cg(,gUuAo.oSUE5bg"></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="3B:8FI{Q@V!xI(*IzlOX" x="484" y="89"><field name="NAME">agarrarLata</field><statement name="STACK"><block type="repetir" id="RBh^/;R@4V%exx{|{DV`"><value name="count"><shadow type="required_value" id="[=m|7quCO8,?Yp%=;Eg#"></shadow><block type="math_number" id=";Ec-;Q5HOC:aOb4zhh-C"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="y|L})~hjY+%xORr=[`5`"></shadow><block type="MoverACasillaArriba" id="?Y6@FXahcC@mGKg[]Z1J"></block></statement><next><block type="TomarLata" id="uvQ}9nNj*FC^#C$2|46c"><next><block type="repetir" id="q|/Xv9(0#yLL6/2Q?;PF"><value name="count"><shadow type="required_value" id="zujehjT9{c%=h1L2[NHZ"></shadow><block type="math_number" id="da{~mSn0qO#kB|7[j[@`"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="+N4)8|Y)(`n(6R/z,RlS"></shadow><block type="MoverACasillaAbajo" id="g9z9U=]IlBUK(}vL6Qt:"></block></statement><next><block type="Colocar" id="V#{P?`h?134Y@MEj57/L"></block></next></block></next></block></next></block></statement></block></xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al tirar en el tacho cuando no tengo nada',
		solucion:'<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="J;fm@E$*cAyjoQ^q-(]#" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="-8!hD4cmMC#/Tt`z`oCm"></shadow><block type="Colocar" id="^7J6N9H`ifIJ[+gs|S5H"></block></statement></block></xml>',
		errorEsperado: 'No tengo nada en la mano'
	});

	actividadTest(nombre, {
		descripcionAdicional: ' Da error al querer irse sin limpiar el humedal',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="J;fm@E$*cAyjoQ^q-(]#" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="oUIZyToTrw6};w;Jsy/7"></shadow><block type="IrseEnYacare" id="JF/iM)gS/BDtVhDC0Jr*"></block></statement></block></xml>',
		errorEsperado: 'Para escapar hace falta un transporte'		
	});

});