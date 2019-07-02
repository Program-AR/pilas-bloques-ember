import { Promise } from 'rsvp';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function (name, options = {}) {

  module(name, (hooks) => {

    setupRenderingTest(hooks);
    setupMirage(hooks);
    // runActivityTests();

    hooks.beforeEach(function () {
      this.application = startApp();
      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    }),

      hooks.afterEach(function () {
        let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(() => destroyApp(this.application));
      })

  });

}
