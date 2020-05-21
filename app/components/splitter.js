import Component from '@ember/component';

export default Component.extend({
  classNames: ['splitter'],

  didInsertElement() {
    var md; // remember mouse down info
    const first = document.getElementById("splitter-first-child");
    const second = document.getElementById("splitter-second-child");

    function dragElement(element, direction) {

      element.onmousedown = onMouseDown;

      function onMouseDown(e) {
        //console.log("mouse down: " + e.clientX);
        md = {
          e,
          offsetLeft: element.offsetLeft,
          offsetTop: element.offsetTop,
          firstWidth: first.offsetWidth,
          secondWidth: second.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
          //console.log("mouse up");
          document.onmousemove = document.onmouseup = null;
        }
      }

      function onMouseMove(e) {
        //console.log("mouse move: " + e.clientX);
        var delta = {
          x: e.clientX - md.e.x,
          y: e.clientY - md.e.y
        };

        if (direction === "H") // Horizontal
        {
          // prevent negative-sized elements
          delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
            md.secondWidth);

          element.style.left = md.offsetLeft + delta.x + "px";
          first.style.width = (md.firstWidth + delta.x) + "px";
          second.style.width = (md.secondWidth - delta.x) + "px";
        }
      }
    }

    if (first != null && second != null) {
      dragElement(document.getElementById("separator"), "H");
    }

  },

});