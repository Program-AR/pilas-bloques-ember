import Component from '@ember/component';

export default Component.extend({
  classNames: ['pilas-splitter'],

    didInsertElement() {
      $(window).resize(() => {
        this.fixLayout();
      });

      this.$('#splitter').on("mousedown", (event) => {
        event.preventDefault();

        $('#over-splitter').show();

        let initialX = event.pageX;
        let initialWidth = $(this.panel).width();

        $('#over-splitter').on("mousemove", (event) => {
          let dx = (event.pageX - initialX);
          let newWidth = initialWidth + dx;

          // Aplica límites de tamaño, entre 200 y 800.
          newWidth = Math.max(newWidth, 200);
          newWidth = Math.min(newWidth, 800);

          $(this.panel).width(newWidth);

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
      let width = $(this.iframe).width();
      let height = width * 1.1428;

      $(this.iframe).height(height);
      $(this.ayuda).css('top', height);
    },
});
