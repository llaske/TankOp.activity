var app;
var play;
var mouse = {};

define(function (require) {
    var activity = require("sugar-web/activity/activity");

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();
		
		// Save mouse position
		document.onmousemove = function(e) { mouse.position = {x: e.pageX, y: e.pageY}; }
		
		// Launch main screen
		app = new TankOp.App().renderInto(document.getElementById("board"));
    });

});
