if (is_nodewebkit) {
  process.on("uncaughtException", function(e) {
    console.log(e, e.stack);
    window.last_exception = e;
    document.title = "ERROR: " + e;
  });
}
