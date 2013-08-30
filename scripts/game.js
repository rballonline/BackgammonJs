var Game = {
	/* Setup globals */
	width: 768,
	height: 768,
    blackOff: 0,
    whiteOff: 0,
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
    }
};