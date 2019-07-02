import Application from '../app';
import config from '../config/environment';
import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import resolver from './helpers/resolver';
import TestLoader from 'ember-cli-test-loader/test-support';

function includesFirstBookChallenges(moduleName) {
    return moduleName.includes("Coty-test") ||
        moduleName.includes("Duba-AlternativaCondicional-test") ||
        moduleName.includes("Duba-PrimerosProgramas-test") ||
        moduleName.includes("Duba-Repeticion-test") ||
        moduleName.includes("Lita-AlternativaCondicional-test") ||
        moduleName.includes("Lita-PrimerosProgramas-test") ||
        moduleName.includes("Lita-Repeticion-test") ||
        moduleName.includes("TotoEscritor-test") ||
        moduleName.includes("TotoLector-test");
}

function includesChallenges(moduleName) {
    return moduleName.includes("AlienTocaBoton-test") ||
        moduleName.includes("BlockIDGeneration-test") ||
        moduleName.includes("BlocksGallery-test") ||
        // moduleName.includes("DibujandoFiguras-test") ||
        moduleName.includes("ElAlienYLasTuercas-test") ||
        moduleName.includes("ElCangrejoAguafiestas-test") ||
        moduleName.includes("ElDetectiveChaparro-test") ||
        moduleName.includes("ElGatoEnLaCalle-test") ||
        moduleName.includes("ElMarcianoEnElDesierto-test") ||
        moduleName.includes("ElMonoCuentaDeNuevo-test") ||
        moduleName.includes("ElMonoQueSabeContar-test") ||
        moduleName.includes("ElMonoYLasBananas-test") ||
        moduleName.includes("ElPlanetaDeNano-test") ||
        moduleName.includes("ElRecolectorDeEstrellas-test") ||
        moduleName.includes("ElSuperViaje-test") ||
        moduleName.includes("FutbolDeRobots-test") ||
        moduleName.includes("InstalandoJuegos-test") ||
        moduleName.includes("LaberintoConQueso-test") ||
        moduleName.includes("LaberintoCorto-test") ||
        moduleName.includes("LaberintoLargo-test") ||
        moduleName.includes("LaEleccionDelMono-test") ||
        moduleName.includes("LaFiestaDeDracula-test") ||
        moduleName.includes("LaGranAventuraDelMarEncantado-test") ||
        moduleName.includes("MariaLaComeSandias-test") ||
        moduleName.includes("NoMeCansoDeSaltar-test") ||
        moduleName.includes("PrendiendoLasCompus-test") ||
        moduleName.includes("PrendiendoLasCompuesParametrizado-test") ||
        moduleName.includes("PrendiendoLasFogatas-test") ||
        moduleName.includes("ReparandoLaNave-test") ||
        moduleName.includes("SalvandoLaNavidad-test") ||
        moduleName.includes("SuperTito1-test") ||
        moduleName.includes("SuperTito2-test") ||
        moduleName.includes("TitoCuadrado-test") ||
        moduleName.includes("TitoEnciendeLasLuces-test") ||
        moduleName.includes("TitoRecargado-test") ||
        moduleName.includes("TresNaranjas-test");
}

function includesPilasExcersises(moduleName) {
    return moduleName.includes("Casilla-test") ||
        moduleName.includes("Cuadricula-test") ||
        moduleName.includes("CuadriculaEsparsa-test") ||
        moduleName.includes("Estado-test") ||
        moduleName.includes("ImagenesPreCarga-test") ||
        moduleName.includes("Interactuar-test") ||
        moduleName.includes("StatePattern-test");
}

//Needs fix.
// function includesComponents(moduleName) {
//     return moduleName.includes("pilas-blockly-test") ;
//     // moduleName.includes("modal-ayuda-test") ||
//     // moduleName.includes("modal-title-test") ||
//     // moduleName.includes("pilas-acerca-de-test") ||
//     // moduleName.includes("pilas-botones-zoom-test") ||
//     // moduleName.includes("pilas-canvas-test") ||
//     // moduleName.includes("pilas-cargando-test") ||
//     // moduleName.includes("pilas-desafio-test") ||
//     // moduleName.includes("pilas-editor-test") ||
//     // moduleName.includes("pilas-header-test") ||
//     // moduleName.includes("pilas-libro-test") ||
//     // moduleName.includes("pilas-notificador-test") ||
//     // moduleName.includes("pilas-spinner-test") ||
//     // moduleName.includes("pilas-toggle-test") ||
//     // moduleName.includes("pilasweb-actores-test")
// }

function includesAcceptance(moduleName) {
    return moduleName.includes("acercade-test") ||
        moduleName.includes("desafios-test") ||
        moduleName.includes("principal-test") ||
        moduleName.includes("puede-ingresar-en-actividades-test");
}

// optionally override TestLoader.prototype.shouldLoadModule
TestLoader.prototype.shouldLoadModule = function (moduleName) {
    return includesFirstBookChallenges(moduleName) ||
        includesChallenges(moduleName) ||
        includesPilasExcersises(moduleName) ||
        includesAcceptance(moduleName);
}

setResolver(resolver);
setApplication(Application.create(config.APP));
start();