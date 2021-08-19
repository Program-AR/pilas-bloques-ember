import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { setupPBIntegrationTest } from '../../helpers/utils'
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

export default function (name, options = {}) {

  module(name, (hooks) => {

    setupPBIntegrationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
      this.application = startApp();
      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    })

    hooks.afterEach(function () {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    })

  });

}
