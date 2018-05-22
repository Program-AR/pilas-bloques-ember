// Copyright Alfredo Héctor Sanzo - asanzo@github

// Takes a function, evaluates it "this" times.
Number.prototype.timesRepeat = function(f){
	for(var i=0; i<this; i++){
		f();
	}
}

// Takes an object, gives back a list with the object repeated "this" times.
Number.prototype.times = function(object){
	var l = [];
	this.timesRepeat(function(){l.push(object)});
	return l;
}
