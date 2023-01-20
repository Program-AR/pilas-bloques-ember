import Component from '@ember/component';
import ReactDOM from 'react-dom';


export default Component.extend({

  /**
   * We don't need a template since we're only creating a
   * wrapper for our React component
   **/
  layout: '',

  /**
   * Renders a react component as the current ember element
   * @param {React.Component} reactComponent. e.g., <HelloWorld />
   */
  reactRender(reactComponent) {
    ReactDOM.render(reactComponent, this.element);
  },

  /**
   * Removes a mounted React component from the DOM and
   * cleans up its event handlers and state.
   */
  unmountReactElement() {
    ReactDOM.unmountComponentAtNode(this.element);
  },

  /**
   * Cleans up the rendered react component as the ember
   * component gets destroyed
   */
  willDestroyComponent() {
    this._super();
    this.unmountReactElement();
  }

})