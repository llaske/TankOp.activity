
settings = {};



// Settings dialog
enyo.kind({
	name: "TankOp.Settings",
	kind: "enyo.Popup",
	classes: "settings-dialog",
	modal: true,
	floating: true,
	autoDismiss: false,
	centered: true,	
	components: [
		{content: "TANK OPERATION", classes: "settings-title"},
		{classes: "settings-item", components:[
			{content: "TERRAIN", classes: "settings-text settings-line settings-header"},
			{classes: "go-left settings-line", ontap: "prevMap"},
			{kind: "Image", name: "maptype", src:"images/grass.png", classes: "settings-map settings-line"},
			{classes: "go-right settings-line", ontap: "nextMap"},
			{name: "mapcost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components:[
			{content: "HEADQUARTER", classes: "settings-text settings-line settings-header2"},
			{kind: "Image", src:"images/hq_blue.png", classes: "settings-map settings-unit settings-line"},
			{classes: "go-left settings-line", ontap: "lessHq"},
			{name: "hqnumber", content: "99", classes: "settings-text settings-line settings-unitnumber"},			
			{classes: "go-right settings-line", ontap: "moreHq"},
			{name: "hqcost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components:[
			{content: "HELICOPTERE", classes: "settings-text settings-line settings-header2"},
			{kind: "Image", src:"images/helo_blue_2.png", classes: "settings-map settings-unit settings-line"},
			{classes: "go-left settings-line", ontap: "lessHelo"},
			{name: "helonumber", content: "99", classes: "settings-text settings-line settings-unitnumber"},			
			{classes: "go-right settings-line", ontap: "moreHelo"},
			{name: "helocost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components:[
			{content: "CANON", classes: "settings-text settings-line settings-header2"},
			{kind: "Image", src:"images/canon_blue_2.png", classes: "settings-map settings-unit settings-line"},
			{classes: "go-left settings-line", ontap: "lessCanon"},
			{name: "canonnumber", content: "99", classes: "settings-text settings-line settings-unitnumber"},			
			{classes: "go-right settings-line", ontap: "moreCanon"},
			{name: "canoncost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components:[
			{content: "TANK", classes: "settings-text settings-line settings-header2"},
			{kind: "Image", src:"images/tank_blue_2.png", classes: "settings-map settings-unit settings-line"},
			{classes: "go-left settings-line", ontap: "lessTank"},
			{name: "tanknumber", content: "99", classes: "settings-text settings-line settings-unitnumber"},			
			{classes: "go-right settings-line", ontap: "moreTank"},
			{name: "tankcost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components:[
			{content: "SOLDAT", classes: "settings-text settings-line settings-header2"},
			{kind: "Image", src:"images/soldier_blue_2.png", classes: "settings-map settings-unit settings-line"},
			{classes: "go-left settings-line", ontap: "lessSoldier"},
			{name: "soldiernumber", content: "99", classes: "settings-text settings-line settings-unitnumber"},			
			{classes: "go-right settings-line", ontap: "moreSoldier"},
			{name: "soldiercost", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}
		]},
		{classes: "settings-item", components: [
			{content: "TOTAL", classes: "settings-text settings-line settings-total"},
			{name: "total", content: "99", classes: "settings-text settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}			
		]},
		{content: "DEMARRER", classes: "settings-button", ontap: "startGame"},
		{classes: "settings-ecoin", components: [
			{name: "ecoin", content: "99", classes: "settings-text2 settings-line settings-footer"},
			{kind: "Image", src: "images/e-coin.png", classes: "settings-coin settings-line"}			
		]},		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
	},
	
	// Init
	init: function() {
		this.ecoin = 100; // TODO
	
		this.maps = [{name:"grass", cost: constant.costGrass}, {name:"trees", cost: constant.costTrees}, {name: "mountain", cost: constant.costMountain}],
		this.mapindex = 0;
		settings.map = "grass";
		settings.hq = 1;
		settings.helo = 0;
		settings.canon = 0;
		settings.tank = 0;
		settings.soldier = 0;
		
		this.total = 1;
		
		this.draw();
	},
	
	// Draw settings
	draw: function() {
		this.$.total.setContent(this.total);
		this.$.ecoin.setContent((this.ecoin-this.total));
		this.$.maptype.setSrc("images/"+this.maps[this.mapindex].name+".png");
		this.$.mapcost.setContent(this.maps[this.mapindex].cost);	
		this.$.hqnumber.setContent(settings.hq);
		this.$.hqcost.setContent((settings.hq-1)*constant.costHq);		
		this.$.helonumber.setContent(settings.helo);
		this.$.helocost.setContent(settings.helo*constant.costHelo);		
		this.$.canonnumber.setContent(settings.canon);
		this.$.canoncost.setContent(settings.canon*constant.costCanon);
		this.$.tanknumber.setContent(settings.tank);
		this.$.tankcost.setContent(settings.tank*constant.costTank);
		this.$.soldiernumber.setContent(settings.soldier);
		this.$.soldiercost.setContent(settings.soldier*constant.costSoldier);
	},
	
	// Change settings event
	prevMap: function() {
		var newindex = this.mapindex - 1;
		if (newindex < 0) newindex = this.maps.length-1;
		if ((this.total + this.maps[newindex].cost) > this.ecoin) return;
		this.mapindex = newindex;
		settings.map = this.maps[newindex].name;
		this.updateTotal();
	},
	nextMap: function() {
		var newindex = this.mapindex + 1;
		if (newindex == this.maps.length) newindex = 0;
		if ((this.total + this.maps[newindex].cost) > this.ecoin) return;
		this.mapindex = newindex;
		settings.map = this.maps[newindex].name;		
		this.updateTotal();
	},
	lessHq: function() {
		if (settings.hq == 1) return;
		settings.hq = settings.hq-1;
		this.updateTotal();
	},
	moreHq: function() {
		if (settings.hq == 4 || (this.total + constant.costHq) > this.ecoin) return;
		settings.hq = settings.hq+1;
		this.updateTotal();
	},
	lessHelo: function() {
		if (settings.helo == 0) return;
		settings.helo = settings.helo-1;
		this.updateTotal();
	},
	moreHelo: function() {
		if (this.reachUnitLimit() || (this.total + constant.costHelo) > this.ecoin) return;
		settings.helo = settings.helo+1;
		this.updateTotal();
	},	
	lessCanon: function() {
		if (settings.canon == 0) return;
		settings.canon = settings.canon-1;
		this.updateTotal();
	},
	moreCanon: function() {
		if (this.reachUnitLimit() || (this.total + constant.costCanon) > this.ecoin) return;
		settings.canon = settings.canon+1;
		this.updateTotal();
	},	
	lessTank: function() {
		if (settings.tank == 0) return;
		settings.tank = settings.tank-1;
		this.updateTotal();
	},
	moreTank: function() {
		if (this.reachUnitLimit() || (this.total + constant.costTank) > this.ecoin) return;
		settings.tank = settings.tank+1;
		this.updateTotal();
	},	
	lessSoldier: function() {
		if (settings.soldier == 0) return;
		settings.soldier = settings.soldier-1;
		this.updateTotal();
	},
	moreSoldier: function() {
		if (this.reachUnitLimit() || (this.total + constant.costSoldier) > this.ecoin) return;
		settings.soldier = settings.soldier+1;
		this.updateTotal();
	},	
	
	// Compute unit limit: max 3 units by HQ
	reachUnitLimit: function() {
		return (settings.helo+settings.canon+settings.tank+settings.soldier) == (settings.hq*3);
	},
	
	// Compute total
	updateTotal: function() {
		this.total = this.maps[this.mapindex].cost
			+ (settings.hq-1)*constant.costHq
			+ settings.helo*constant.costHelo
			+ settings.canon*constant.costCanon
			+ settings.tank*constant.costTank
			+ settings.soldier*constant.costSoldier;
		
		this.draw();
		this.render();
	},
	
	// Start game
	startGame: function() {
		this.hide();
	}
});