import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

const nombre = 'ElPasilloCurvoDeCelus';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"nq:@0iFSoq3$d(k@Eyn)\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"Gi#8Z8tcN~W_@|E;egC8\"></shadow><block type=\"procedures_callnoreturn\" id=\"K[(,6E%+-p`1Wf4;QV~c\"><mutation name=\"Ir a la primera curva\"></mutation><next><block type=\"procedures_callnoreturn\" id=\":{.-US4=W`GPJ|$!g(/9\"><mutation name=\"Desbloquear celulares en una curva\"></mutation><next><block type=\"procedures_callnoreturn\" id=\",:[Xs(mO*Ar{*!]@E-h.\"><mutation name=\"Ir a la segunda curva\"></mutation><next><block type=\"procedures_callnoreturn\" id=\"P$B|j[b8D(h$Bsia]5M[\"><mutation name=\"Desbloquear celulares en una curva\"></mutation></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" id=\"+u9oz|RynBSnIaKjlO~s\" x=\"-136\" y=\"200\"><field name=\"NAME\">Ir a la primera curva</field><statement name=\"STACK\"><block type=\"MoverACasillaArriba\" id=\"Y8hDlb0JOxkH{8FJDO[c\"></block></statement></block><block type=\"procedures_defnoreturn\" id=\"35([]05wG,t_q4sVKB4O\" x=\"176\" y=\"201\"><field name=\"NAME\">Ir a la segunda curva</field><statement name=\"STACK\"><block type=\"repetir\" id=\"ZDwylh914vMqPcM{H^^A\"><value name=\"count\"><shadow type=\"required_value\" id=\":f|/GRT29q:*@NalN)5=\"></shadow><block type=\"math_number\" id=\"/2)^k=+BxP]yav,GzAW4\"><field name=\"NUM\">2</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"h{[2wL/=olmY@liF?JNI\"></shadow><block type=\"MoverACasillaArriba\" id=\"EjICmeJcg!}dCI4ys:d9\"></block></statement><next><block type=\"MoverACasillaDerecha\" id=\"V@G*D4dzq`7avM~5@BA`\"></block></next></block></statement></block><block type=\"procedures_defnoreturn\" id=\"?aMs1@vptR;JcgY]|?/(\" x=\"-138\" y=\"301\"><field name=\"NAME\">Desbloquear celulares en una curva</field><statement name=\"STACK\"><block type=\"procedures_callnoreturn\" id=\"-*(nb@^*~8l}t]sV},=K\"><mutation name=\"Cargar celular si hay\"></mutation><next><block type=\"repetir\" id=\",NdyL._[8_5`Q_lSwCHB\"><value name=\"count\"><shadow type=\"required_value\" id=\"G|SWhB#4O1rfhBdk50g5\"></shadow><block type=\"math_number\" id=\"+%6GD9=:RVdEO3=d=kYq\"><field name=\"NUM\">2</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"2JBP($5lZw$kiw}VZbE?\"></shadow><block type=\"MoverACasillaDerecha\" id=\"%K)|*@|4PYghC|7=ACct\"><next><block type=\"procedures_callnoreturn\" id=\"/)A=xFRVN(Zo!yfDmyRM\"><mutation name=\"Cargar celular si hay\"></mutation></block></next></block></statement><next><block type=\"repetir\" id=\"*P@GpQY#93]bJzUH`y#(\"><value name=\"count\"><shadow type=\"required_value\" id=\"^i^:Y;kJZ[WI!H{#}Xo!\"></shadow><block type=\"math_number\" id=\"AF8gWfRb](bRhiNPaojK\"><field name=\"NUM\">2</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"D[9nlKqwdC%$.aMF:cS|\"></shadow><block type=\"MoverACasillaArriba\" id=\"0C`e./*r5bsOzfk=H*R=\"><next><block type=\"procedures_callnoreturn\" id=\"fv|Nc,d@9S7gWD:D%MuG\"><mutation name=\"Cargar celular si hay\"></mutation></block></next></block></statement><next><block type=\"repetir\" id=\"=PvUX||b[o#QrXSTvXA5\"><value name=\"count\"><shadow type=\"required_value\" id=\"]gF@bvkJ.rQ41~!*DNRs\"></shadow><block type=\"math_number\" id=\"Il5%JQ|LuU7^VH{h!,Aj\"><field name=\"NUM\">2</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"1;Q5|]UmBm:!W|9bU;tU\"></shadow><block type=\"MoverACasillaIzquierda\" id=\"qXbYW!Vte[U1Y00!EKV(\"><next><block type=\"procedures_callnoreturn\" id=\".Y=}qfPXe_{gar?a[^k6\"><mutation name=\"Cargar celular si hay\"></mutation></block></next></block></statement></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" id=\"0?7=M-dV3i~R)#o*=:cR\" x=\"120\" y=\"450\"><field name=\"NAME\">Cargar celular si hay</field><statement name=\"STACK\"><block type=\"Si\" id=\"C:Wht3aZN8!lCU;}hB=_\"><value name=\"condition\"><shadow type=\"required_value\" id=\"v4WrZ5|QN`bb[^zqEz|*\"></shadow><block type=\"TocandoCelular\" id=\"}?29]0_0ZjOF~_~QJ6!`\"></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"2eG%Nc{[!4Ui4~A!C2cN\"></shadow><block type=\"DesbloquearCelular\" id=\":8-+Gj{?d~[gN}nWf6(M\"></block></statement></block></statement></block></xml>'
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia una dirección sin casillero',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"x2]I~HEBdBo]@rZlv`cD\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"iB`wKtkb?m?XklR|w[5|\"></shadow><block type=\"MoverACasillaIzquierda\" id=\"omBdgDn9-.7]8X)k}4Rh\"></block></statement></block></xml>',
		errorEsperado: 'No puedo ir para la izquierda',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer usar un celular donde no hay',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"Ic?-8k?GRb_RKu*.Wbef\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"xUy0FFwiu./5J7$bCdgP\"></shadow><block type=\"DesbloquearCelular\" id=\"yG#3}L]c$VypQGMH5on~\"></block></statement></block></xml>',
		errorEsperado: 'Acá no hay un celular',
	});

});