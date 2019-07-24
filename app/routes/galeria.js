import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  blockly: service(),
  blocksGallery: service(),

  activate() {
    this.blocksGallery.start();
  }

});
