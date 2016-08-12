import resolver from './helpers/resolver';
import './helpers/responsive';

import {
  setResolver
} from 'ember-qunit';
/* global QUnit */

QUnit.config.testTimeout = 100000; // 60000 es el valor por omisión
setResolver(resolver);
