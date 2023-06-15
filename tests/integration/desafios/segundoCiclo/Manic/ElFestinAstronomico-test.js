import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "ElFestinAstronomico";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"RwfGP#m{vx4oSSJN*0@~\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"_Y$A}H2*7.C6p0}f$)?{\"></shadow><block type=\"procedures_callnoreturn\" id=\":3%`~et~2[);}Fh[2eZ=\"><mutation name=\"festin\"></mutation><next><block type=\"MoverACasillaDerecha\" id=\"tpUy~%*v@gpqzwgShIx1\"><next><block type=\"repetir\" id=\"TN5KxJ#Fbj^/Wy,*m##i\"><value name=\"count\"><shadow type=\"required_value\" id=\"$az::/W1~tEh1KHOZCwy\"></shadow><block type=\"math_number\" id=\"2bz6,Zp7V~5rnfR*oV}s\"><field name=\"NUM\">2</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"g/ufgcwQ:/$#zaUTgic,\"></shadow><block type=\"procedures_callnoreturn\" id=\"3[@HFjZF`w1zPxsCzzWW\"><mutation name=\"festin\"></mutation></block></statement><next><block type=\"procedures_callnoreturn\" id=\"YrFXKFP#j+wG+i(!Dw|W\"><mutation name=\"columna\"></mutation></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" id=\"KR.jO38c#mbev}stOl5B\" x=\"346\" y=\"8\"><field name=\"NAME\">columna</field><statement name=\"STACK\"><block type=\"repetir\" id=\"8/-v)yr`G(h;qYBkxAwZ\"><value name=\"count\"><shadow type=\"required_value\" id=\"(hXcl)TA{!?w+=T?OHCr\"></shadow><block type=\"math_number\" id=\"jaoN1[1qPfG8C[{2Fjg)\"><field name=\"NUM\">6</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"C%62PX?|B;gy5y,6t^r:\"></shadow><block type=\"MoverACasillaAbajo\" id=\":0~k}jHxwuz7(L_8F$B[\"><next><block type=\"Si\" id=\")TquEJWK5K-Nr]GMh^qG\"><value name=\"condition\"><shadow type=\"required_value\" id=\"K_}udw{%D%z|qm|,O6dU\"></shadow><block type=\"TocandoEstrellaManic\" id=\"=jo,SeY7mSZqkWv!),:y\"></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"FyYS50/j?]?3.cuIb+(_\"></shadow><block type=\"ObservarEstrella\" id=\"a3L%I_Mw+SRQ%Byw,DV^\"></block></statement><next><block type=\"Si\" id=\"_,4=lo,*XMWfQ-KlP$)q\"><value name=\"condition\"><shadow type=\"required_value\" id=\"AcRwr6@-Qb=e)?kUV|79\"></shadow><block type=\"TocandoPlaneta\" id=\"7jw7]W.WUXpqFxa.=3vF\"></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"d00#NN+j}?kN8`6po1u[\"></shadow><block type=\"ObservarPlaneta\" id=\"5`oQUyedZ-1MOWENn?(G\"></block></statement></block></next></block></next></block></statement></block></statement></block><block type=\"procedures_defnoreturn\" id=\"9Lf8yevYA=r|g6vLRXZ7\" x=\"95\" y=\"215\"><field name=\"NAME\">festin</field><statement name=\"STACK\"><block type=\"procedures_callnoreturn\" id=\"ww1#X~L:w,1e{6My//1$\"><mutation name=\"columna\"></mutation><next><block type=\"repetir\" id=\"@N^nkEs7%}`P]{@jL}GQ\"><value name=\"count\"><shadow type=\"required_value\" id=\"|l[-(Yy9wnGV?:3gyTF|\"></shadow><block type=\"math_number\" id=\"aV?Ff7X_j@Ju*}+p8,q]\"><field name=\"NUM\">6</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"52GWwY9w%Z8xDI*m`A$G\"></shadow><block type=\"MoverACasillaArriba\" id=\"a]`u=t,qk$Avmp3*^S9j\"></block></statement><next><block type=\"MoverACasillaDerecha\" id=\"QAv7aS*)?Xx^gm.7J`[D\"></block></next></block></next></block></statement></block></xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia una dirección sin casillero',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"o}Nru3:5z?7mC$~mS?n@\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"tb=/CiRc,Q-d}PtH)ggS\"></shadow><block type=\"MoverACasillaDerecha\" id=\"}!/p-d7I8s^1YguTtrtU\"><next><block type=\"MoverACasillaAbajo\" id=\"ONP;ZMFL::pjs7SpPANm\"></block></next></block></statement></block></xml>',
		errorEsperado: '¡Hay un obstáculo!',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error querer observar un astro donde no hay',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"te(fxhcv2r6N0lRb;hD=\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"#_A9.lrLzrUgmMEz$Bil\"></shadow><block type=\"ObservarEstrella\" id=\"EDt}O2P#3zZ*wWcZYIx~\"></block></statement></block></xml>',
		errorEsperado: 'Acá no hay una estrella',
	});

});