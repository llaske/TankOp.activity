
// Play class
enyo.kind({
	name: "TankOp.Play",
	kind: enyo.Control,
	classes: "board",
	components: [
		// Status and score
		{classes: "status-line", components: [
			{content: "WAVE", classes: "wave-text"},
			{name: "wave", content: "1", classes: "wave-value"},
			{content: "SCORE", classes: "score-text"},
			{name: "score", content: "0000", classes: "score-value"}
		]},
		
		// Playing zone
		{name: "gamebox", classes: "game-box", ontap: "gameClick", components: [
		]},
		
		// LCD counter
		{name: "lcd", kind: "LcdDisplay", classes: "lcd-value", size: 3, value: ""},
		
		// Key handling
		{kind: "Signals", onkeypress: "keyPressed"},

		// Image cache
		{kind: "ImageCache", showing: false, onCacheLoaded: "cacheLoaded"}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		play = this;
		this.imagesToLoad++;
		this.endOfGame = false;
		this.pausedGame = true;
		this.initializedGame = false;
		
		// Init canvas
		this.$.gamebox.setStyle("width:"+constant.areaWidth+"px; height:"+constant.areaHeight+"px;");
		this.canvas = this.$.gamebox.createComponent({kind: "Canvas", name: "canvas", attributes: {width: constant.areaWidth, height: constant.areaHeight}});

		// Start game loop
		this.loopTimer = window.setInterval(enyo.bind(this, "gameLoopTick"), constant.loopInterval);		
	},
	
	// Init game
	initGame: function() {
		// Init board
		this.initializedGame = true;
		this.game = util.createMap(util.gameMap(settings.map));
		this.targetpos = {x: 7, y: 4};

		// Init units
		var width = constant.boardWidth, height = constant.boardHeight;
		var goodEngine = enyo.bind(this, "goodEngine");
		this.units = []

		// Set HQ
		var step = constant.boardHeight/(settings.hq+1);
		var hqs = [];
		for (var i = 0 ; i < settings.hq ; i++) {
			var hq = util.createUnit({type: "hq", color: "blue", x: 0, y: Math.floor((i+1)*step), engine: null});
			this.units.push(hq);
			hqs.push(hq);
		}
		
		// Create defending units
		var defense = [];
		for(var i = 0 ; i < settings.helo ; i++)
			defense.push({type: "helo", color: "blue", engine: goodEngine});
		for(var i = 0 ; i < settings.canon ; i++)
			defense.push({type: "canon", color: "blue", engine: goodEngine});
		for(var i = 0 ; i < settings.tank ; i++)
			defense.push({type: "tank", color: "blue", engine: goodEngine});
		for(var i = 0 ; i < settings.soldier ; i++)
			defense.push({type: "soldier", color: "blue", engine: goodEngine});
		
		// Set defense around hq
		if (defense.length > 0) {
			var hqindex = 0;
			var defenselength = Math.min(defense.length, 1+hqs.length*2);
			for (var i = 0 ; i < defenselength ; i++) {
				var position = {};
				do {
					var arounds = [{dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1}];
					for (j = 0 ; j < arounds.length ; j++) {
						position = {x: hqs[hqindex].x+arounds[j].dx, y: hqs[hqindex].y+arounds[j].dy};
						if (util.lookForUnit(position) == null)
							break;
						else
							position = {x: -1, y: -1};
					}
					hqindex = (hqindex + 1) % hqs.length;
				} while (position.x == -1);
				defense[i].x = position.x;
				defense[i].y = position.y;
				this.units.push(util.createUnit(defense[i]));
			}
		}
		
		// Get bad units
		this.enemyCount = constant.enemyCount+Math.floor(defenselength/3);
		this.enemyArrivalTurn = constant.enemyArrivalTurn;
		
		// Let's Go !
		this.pausedGame = false;
	},
	
	// Render
	rendered: function() {
		// Init game
		if (!this.initializedGame)
			this.initGame();
	},
	
	cacheLoaded: function() {
	},
	
	// Draw
	draw: function() {
		// Clear all
		var ctx = this.canvas.hasNode().getContext('2d');	
		ctx.clearRect(0, 0, this.canvas.attributes.width, this.canvas.attributes.height);
		
		// Draw board
		var grass = document.getElementById("grass");
		var trees = document.getElementById("trees");
		var mountain = document.getElementById("mountain");
		var water = document.getElementById("water");
		for (var i = 0 ; i < constant.boardHeight ; i++ ) {
			for (var j = 0 ; j < constant.boardWidth ; j++ ) {
				ctx.save();
				ctx.translate(j*constant.tileSize, i*constant.tileSize);
				ctx.drawImage(grass, 0, 0);
				var tileType = this.game[i][j];
				if (tileType == constant.tileTrees)
					ctx.drawImage(trees, 0, 0);
				else if (tileType == constant.tileMountain)
					ctx.drawImage(mountain, 0, 0);
				else if (tileType == constant.tileWater)
					ctx.drawImage(water, 0, 0);
				ctx.restore();
			}
		}
		
		// Draw tanks
		if (!this.endOfGame) {
			for (var i = 0 ; i < this.units.length ; i++)
				this.units[i].draw(ctx);
			
			// Draw target
			var target = document.getElementById("target");		
			ctx.save();
			ctx.translate(this.targetpos.x*constant.tileSize, this.targetpos.y*constant.tileSize);
			ctx.drawImage(target, 0, 0);	
			ctx.restore();				
		}
		
		// Draw end of game screen
		else {	
			var endscreen = this.win ? document.getElementById("endgame_victory") :  document.getElementById("endgame_defeat");
			ctx.save();
			ctx.translate((constant.areaWidth-constant.endGameWidth)/2, (constant.areaHeight-constant.endGameHeight)/2);
			ctx.drawImage(endscreen, 0, 0);	
			ctx.restore();		
		}
				
	},
	
	// A key was pressed
	keyPressed: function(s, e) {
		var key = e.charCode;
		if (this.endOfGame)
			return;
			
		// Digit key
		if (key >= 48 && key <= 57) {
			// Add digit to string
			var value = this.$.lcd.getValue();
			if (value.length == this.$.lcd.getSize())
				value = value.substr(1);
			value += String.fromCharCode(key);
			this.$.lcd.setValue(value);
		}

		// Dash key
		else if (key == 45) {
			this.$.lcd.setValue("-");
		}
		
		// Fire key
		else if (key == 32) {
			// Find the right operation
			console.log("FIRE on #"+this.$.lcd.getValue().replace(/ /g,'')+"#");
			this.$.lcd.setValue("");
			//this.targetpos.x = newX;
			//this.targetpos.y = newY;	
		}
	},
	
	// A tap occur on the game
	gameClick: function() {		
		// At end of game, quit		
		if (this.endOfGame) {
			// Stop game loop
			window.clearInterval(this.loopTimer);		
			
			// Back to app
			app.renderInto(document.getElementById("board"));
		}
			
		// Compute direction
		var screen_width = document.documentElement.clientWidth;
		var screen_height = document.documentElement.clientHeight;
		var center_x = Math.floor(screen_width/2.0);
		var center_y = Math.floor((screen_height+constant.pubHeight)/2.0);
		var diffx = mouse.position.x-center_x, diffy = mouse.position.y-center_y;
		var absdiffx = Math.abs(diffx);
		var absdiffy = Math.abs(diffy);
		if (absdiffx >= 0 && absdiffx < constant.fireZoneWidth && absdiffy >= 0 && absdiffy < constant.fireZoneHeight) {
			var targetunit = util.lookForUnit(this.targetpos);
			if (targetunit != null)
				util.processFight(null, targetunit);
			return;
		} else if (absdiffx > absdiffy) {
			dx = diffx > 0 ? 1 : -1;
			dy = 0;
		} else {
			dx = 0;
			dy = diffy > 0 ? 1 : -1;
		}
		
		// Move target
		var newX = this.targetpos.x + dx;
		var newY = this.targetpos.y + dy;
		if (newX < 0 || newX == constant.boardWidth || newY < 0 || newY == constant.boardHeight)
			return;
		this.targetpos.x = newX;
		this.targetpos.y = newY;
	},
	
	// Tick for game loop
	gameLoopTick: function() {
		if (this.pausedGame)
			return;
		
		// Sanitize: clean dead units and compute victory/defeat conditions
		var alives = [];
		var livingHq = 0;
		var livingEnemy = 0;
		for (var i = 0 ; i < this.units.length ; i++) {
			var unit = this.units[i];
			if (unit.power > 0)
				alives.push(unit);
			if (util.getUnitType(unit) == 0)
				livingHq++;
			if (unit.getCurrentImage().indexOf("red") != -1)
				livingEnemy++;				
		}
		this.units = alives;
		this.endOfGame = (livingHq == 0 || (livingEnemy == 0 && this.enemyCount == 0));
		this.win = (livingHq > 0);
		
		// Game play
		if (!this.endOfGame) {
			// Enemy arrival
			if (this.enemyArrivalTurn == 0 && this.enemyCount > 0) {
				var badEngine = enyo.bind(this, "badEngine");
				var width = constant.boardWidth;
				var height = constant.boardHeight;
				var stats = [-1, constant.statSoldier, constant.statTank, constant.statCanon, constant.statHelo];
				var unit = {type: util.randomUnit(), color: "red", heading:0, engine: badEngine, x: width-1, y: util.random(height)};
				this.units.push(util.createUnit(unit));
				this.enemyCount = this.enemyCount-1;
				this.enemyArrivalTurn = constant.enemyArrivalTurn;
			} else {
				this.enemyArrivalTurn = this.enemyArrivalTurn - 1;
			}
			
			// Launch engine for each unit
			for (var i = 0 ; i < this.units.length ; i++) {
				var engine = this.units[i].engine;
				if (engine != null)
					engine(this.units[i]);
			}
		}
		
		// Draw
		this.draw();
	},
	
	// Engine for good tank moves
	goodEngine: function(that) {
		// Look for enemy unit
		var opponent = util.lookForOpponent(that);
		if (opponent != null) {
			// Change heading toward opponent
			that.heading = opponent.heading;
			
			// Fight
			util.processFight(that, opponent.unit);			
			return;
		}
	},
	
	// Engine for bad tank moves
	badEngine: function(that) {
		// Look for enemy unit
		var opponent = util.lookForOpponent(that);
		if (opponent != null) {
			// Change heading toward opponent
			that.heading = opponent.heading;
			
			// Fight
			util.processFight(that, opponent.unit);
			return;
		}

		// Is it a valid position ?
		var next = util.nextPositionOnHeading(that);		
		while (!util.isValidPosition(next, that)) {
			// No, reverse sense
			that.heading = util.random(4);
			next = util.nextPositionOnHeading(that);
		}
		next = util.nextPositionOnHeading(that);
		that.x = next.x;
		that.y = next.y;
	}
});
