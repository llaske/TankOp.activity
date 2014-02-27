
// Main app class
enyo.kind({
	name: "TankOp.App",
	kind: enyo.Control,
	classes: "home",
	components: [
		// Image 
		{kind: "Image", src: "images/home.png"},
		
		// Popup
		{content: "START", classes: "start-button", ontap: "play"}	
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		sound.play("audio/soundtrack", true);
	},
	
	// Play
	play: function() {
		sound.pause();	
		new TankOp.Play().renderInto(document.getElementById("board"));
	}
});
