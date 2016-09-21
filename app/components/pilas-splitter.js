import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-splitter'],

    didInsertElement() {
      $(window).resize(() => {
        this.fixLayout();
      });

      this.$('#splitter').on("mousedown", (event) => {
        event.preventDefault();

        $('#over-splitter').show();

        let initialX = event.pageX;
        let initialWidth = $(this.get("panel")).width();

        $('#over-splitter').on("mousemove", (event) => {
          let dx = (event.pageX - initialX);
          let newWidth = initialWidth + dx;

          // Aplica límites de tamaño, entre 200 y 800.
          newWidth = Math.max(newWidth, 200);
          newWidth = Math.min(newWidth, 800);

          $(this.get("panel")).width(newWidth);

          $(window).trigger('resize');
          window.dispatchEvent(new Event('resize'));
        });

        $('.over-splitter').on("mouseup", function() {
          $('.over-splitter').off("mousemove");
          $('.over-splitter').hide();
        });

      });

    },

    willDestroyElement() {
      $(window).off('resize');
    },

    fixLayout() {
      let width = $(this.get("iframe")).width();
      let height = width * 1.1428;

      $(this.get('iframe')).height(height);
      $(this.get('ayuda')).css('top', height);
    },
});
