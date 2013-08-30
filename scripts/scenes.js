Crafty.scene('Loading', function () {
	Crafty.e('Actor, Text').attr({
		w: Game.width,
		h: 20,
		x: Game.width / 2,
		y: 120
	}).text('Loading');

	Crafty.load(['assets/black.png', 'assets/white.png', 'assets/white_pip.png', 'assets/black_pip.png', 'assets/highlight_pip.png', 'assets/black_off.png', 'assets/white_off.png', 'assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png', 'assets/6.png'],
		function () {
		Crafty.sprite(50, 'assets/black.png', { spr_black: [0, 0] });
		Crafty.sprite(50, 'assets/white_off.png', { spr_white_off: [0, 0] });
		Crafty.sprite(50, 'assets/black_off.png', { spr_black_off: [0, 0] });
		Crafty.sprite(50, 'assets/white.png', { spr_white: [0, 0] });
		Crafty.sprite(70, 'assets/1.png', { spr_1: [0, 0] });
		Crafty.sprite(70, 'assets/2.png', { spr_2: [0, 0] });
		Crafty.sprite(70, 'assets/3.png', { spr_3: [0, 0] });
		Crafty.sprite(70, 'assets/4.png', { spr_4: [0, 0] });
		Crafty.sprite(70, 'assets/5.png', { spr_5: [0, 0] });
		Crafty.sprite(70, 'assets/6.png', { spr_6: [0, 0] });
		Crafty.sprite(50, 200, 'assets/white_pip.png', { spr_white_pip: [0, 0] });
		Crafty.sprite(50, 200, 'assets/black_pip.png', { spr_black_pip: [0, 0] });
		Crafty.sprite(50, 200, 'assets/highlight_pip.png', { spr_highlight_pip: [0, 0] });
/*
		Crafty.audio.add({
			shoot: ["assets/sounds/laser1.wav",
					"assets/sounds/laser1.mp3",
					"assets/sounds/laser1.ogg"],
			explosion: ["assets/sounds/explode1.wav",
					"assets/sounds/explode1.mp3",
					"assets/sounds/explode1.ogg"],
			space: [
				"assets/music/through-space.mp3",
				"assets/music/through-space.ogg"]
		});
*/
		Game.newGame();
	});
});

Crafty.scene('RollToSeeWhoGoesFirst', function() {
    Crafty.e('DisplayText').at(70).text('White:');
    Crafty.e('DisplayText').at(160).text('Black:');

    var white = 0, black = 0;
    while(white === black) {
        white = Crafty.math.randomInt(1, 6);
        black = Crafty.math.randomInt(1, 6);
    }

    Crafty.e(white.toString()).at(100, 60);
    Crafty.e(black.toString()).at(100, 150);

    if(white > black) {
        Game.turn = 'White';
    }
    else {
        Game.turn = 'Black';
    }

    Crafty.e('DisplayText').at(10).text(Game.turn + ' wins the roll. Tap or click to continue').bind('KeyDown', function () {
        Game.playGame();
    });
});

Crafty.scene('Game', function () {
    var board = Crafty.e('Board');

    board.pips[0].addChecker(Crafty.e('WhiteChecker'));
    board.pips[0].addChecker(Crafty.e('WhiteChecker'));

    board.pips[11].addChecker(Crafty.e('WhiteChecker'));
    board.pips[11].addChecker(Crafty.e('WhiteChecker'));
    board.pips[11].addChecker(Crafty.e('WhiteChecker'));
    board.pips[11].addChecker(Crafty.e('WhiteChecker'));
    board.pips[11].addChecker(Crafty.e('WhiteChecker'));

    board.pips[16].addChecker(Crafty.e('WhiteChecker'));
    board.pips[16].addChecker(Crafty.e('WhiteChecker'));
    board.pips[16].addChecker(Crafty.e('WhiteChecker'));

    board.pips[18].addChecker(Crafty.e('WhiteChecker'));
    board.pips[18].addChecker(Crafty.e('WhiteChecker'));
    board.pips[18].addChecker(Crafty.e('WhiteChecker'));
    board.pips[18].addChecker(Crafty.e('WhiteChecker'));
    board.pips[18].addChecker(Crafty.e('WhiteChecker'));

    var pip2 = board.pips[5];
    pip2.addChecker(Crafty.e('BlackChecker'));
});

Crafty.scene('GameOver', function () {
	Crafty.e('DisplayText').at(120).text(Game.turn + ' wins the game. Press a key to play again').bind('KeyDown', function () {
		Game.newGame();
	});
});