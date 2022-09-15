import Application from 'pilasbloques/app';
import config from 'pilasbloques/config/environment';
import * as QUnit from 'qunit';
import { setApplication, setResolver } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import resolver from './helpers/resolver';

setResolver(resolver);
setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
