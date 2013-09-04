var Game = {
	/* Setup globals */
	width: 768,
	height: 768,
    blackOff: 0,
    whiteOff: 0,
    dice: [],
    cubeValue: 1,
    turn: 'White',
	start: function () {
		Crafty.init(Game.width, Game.height);
		Crafty.background('#fafaf2');
		Crafty.scene('Loading');
	},
	newGame: function() {
		Game.blackOff = 0;
		Game.whiteOff = 0;
		//Crafty.scene('RollToSeeWhoGoesFirst');
        Crafty.scene('Game');
	},
    playGame: function() {
        Crafty.scene('Game');
    },
    rollDice: function() {
        var di1 = Crafty.math.randomInt(1,6);
        var di2 = Crafty.math.randomInt(1,6);
        this.dice.push(di1);
        this.dice.push(di2);
        if(di1 == di2) { // handle doubles
            this.dice.push(di1);
            this.dice.push(di2);
        }
    }
};