Math.randomIntBetween = function(start, end) {
    return start + Math.floor(Math.random() * (end - start));
}

Math.randomFrom = function (array) {
    return array[Math.randomIntBetween(0, array.length)];
}

Math.takeRandomFrom = function (array) {
    var index = Math.randomIntBetween(0, array.length);
    return array.splice(index, 1)[0];
}
