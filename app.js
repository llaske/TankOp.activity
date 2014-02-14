
// Main app class
enyo.kind({
	name: "TankOp.App",
	kind: enyo.Control,
	classes: "home",
	components: [
		// Image 
		{kind: "Image", src: "images/home.png"},
		
		// Popup
		{name: "settings", kind: "TankOp.Settings", showing: false, onHide: "play"}		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
	},
	
	// Display settings box
	rendered: function() {
		this.$.settings.init();
		this.$.settings.show();	
	},
	
	// Play
	play: function() {
		new TankOp.Play().renderInto(document.getElementById("board"));
	}
});
