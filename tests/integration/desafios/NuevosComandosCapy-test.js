import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'NuevosComandosCapy';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"GR6U=zK5[PHCYa{x%Bje\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"+I*GON7xR6s=!j4{Gi_9\"></shadow><block type=\"procedures_callnoreturn\" id=\"xbxXm0XtscnnL)3#t2-L\"><mutation name=\"grupo\"></mutation><next><block type=\"procedures_callnoreturn\" id=\"ngx]Y*V48nt0Y+PP=,H$\"><mutation name=\"grupo2\"></mutation><next><block type=\"MoverACasillaAbajo\" id=\"Z-2}o]n:F7@4~DfbsOF}\"><next><block type=\"MoverACasillaAbajo\" id=\"$54:+5,LbPUOjYKTF7i/\"><next><block type=\"procedures_callnoreturn\" id=\":*^flI$EWPHm,ze79d.E\"><mutation name=\"grupo\"></mutation><next><block type=\"procedures_callnoreturn\" id=\"6O=`QKE`$-gK;Y5@_T(o\"><mutation name=\"grupo2\"></mutation><next><block type=\"RecogerLata\" id=\"e:oExCu]Lf84cj]@{Gw=\"></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" id=\"/JOaVw]fMxHlw26;DD3l\" x=\"235\" y=\"161\"><field name=\"NAME\">grupo</field><statement name=\"STACK\"><block type=\"MoverACasillaDerecha\" id=\"?DsE@2T7^_rk5L-QFE9w\"><next><block type=\"MoverACasillaDerecha\" id=\"zi.{IX_W|,b^4eL+U}M!\"><next><block type=\"RecogerLata\" id=\"5#|tAuA_Dk~cZJDW#~l8\"><next><block type=\"MoverACasillaAbajo\" id=\"wTB+rQ},1Lx1/fHb!#l/\"><next><block type=\"RecogerLata\" id=\"!3om;fuw`La30p*1`0t%\"></block></next></block></next></block></next></block></next></block></statement></block><block type=\"MoverACasillaArriba\" id=\"F`:|-{5,TkC8SdKassJ6\" disabled=\"true\" x=\"17\" y=\"190\"></block><block type=\"procedures_defnoreturn\" id=\"/;eCX|^6X$@Qm+hhXFv!\" x=\"3\" y=\"244\"><field name=\"NAME\">grupo2</field><statement name=\"STACK\"><block type=\"MoverACasillaArriba\" id=\"a0|qP];-}vmle9w6Pip@\"><next><block type=\"MoverACasillaIzquierda\" id=\"u~}o;qfy^qU`hs$}=!T%\"><next><block type=\"MoverACasillaIzquierda\" id=\"}pYz}O_|.hC_bggQO/,n\"><next><block type=\"MoverACasillaAbajo\" id=\"8h0yIlz@VqW_-aQP%#i1\"></block></next></block></next></block></next></block></statement></block></xml>'
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia una dirección donde no hay casilla',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\",i_grY4xs|KS{W)=J!-W\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"Q.hb9z#7q?s`jF0!iLJw\"></shadow><block type=\"MoverACasillaIzquierda\" id=\"TJob/~WW,avYNY:H$YjM\"></block></statement></block></xml>',
		errorEsperado: 'No puedo ir para la izquierda',
	});

});