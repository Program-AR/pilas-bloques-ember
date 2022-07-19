import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['pilas-canvas'],
  classNameBindings: ['media.isMobile:media-mobile'],
  iframeElement: null,
  challenge: null,
  pilas: service(),
  experiments: service(),

  didInsertElement() {
    this.set("iframeElement", this.element.querySelector('#innerIframe'))
    this.iframeElement.onload = () => { this.loadScene() }
  },

  didUpdate() {
    this.pilas.setChallenge(this.challenge)
  },

  willDestroyElement() {
    this.pilas.liberarRecursos();
  },

  async loadScene() {
    await this.experiments.saveUserIP()
    await this.pilas.loadPilas(this.get('iframeElement'), { width: 420, height: 480 }, this.challenge)
    await this.pilas.setChallenge(this.challenge)
    if(this.onReady) this.onReady(this.pilas.engine())
  },

});
