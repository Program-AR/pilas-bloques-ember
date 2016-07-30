import resolver from './helpers/resolver';
import './helpers/responsive';

import {
  setResolver
} from 'ember-qunit';

//QUnit.config.testTimeout = 60000; # 60000 es el valor por omisión
setResolver(resolver);
