import resolver from './helpers/resolver';
import './helpers/responsive';

import {
  setResolver
} from 'ember-qunit';
/* global QUnit */

QUnit.config.testTimeout = 5 * 60 * 1000; // 60000 es el valor por omisión = 
setResolver(resolver);
