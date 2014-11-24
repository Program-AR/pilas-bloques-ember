if (is_nodewebkit) {
  process.on("uncaughtException", function(e) {
    console.log(e);
    document.title = "ERROR: " + e;
  });
}
