import Application from '../app';
import config from '../config/environment';
import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import resolver from './helpers/resolver';
//import './helpers/responsive';
import TestLoader from 'ember-cli-test-loader/test-support';


QUnit.config.testTimeout = 100 * 60 * 1000; // 60000 es el valor por omisión = 
setResolver(resolver);

// optionally override TestLoader.prototype.shouldLoadModule
TestLoader.prototype.shouldLoadModule = (moduleName) => moduleName.includes("AlienTocaBoton-test");
TestLoader.load();

setApplication(Application.create(config.APP));
start();