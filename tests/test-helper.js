import Application from '../app';
import config from '../config/environment';
import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import resolver from './helpers/resolver';
import TestLoader from 'ember-cli-test-loader/test-support';

TestLoader.load();

setResolver(resolver);
setApplication(Application.create(config.APP));
start();