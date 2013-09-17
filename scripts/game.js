var game = function () {
	this.width = 768;
	this.height = 768;
	this.dice = [];
	this.pips = [];
	this.checkers = [];
	this.currentPositions = [];
	this.whiteOff = {};
	this.blackOff = {};
	this.numberOfWhitePiecesOff = 0;
	this.numberOfBlackPiecesOff = 0;
	this.turn = 'White';
	this.start = function () {
		Crafty.init(this.width, this.height);
		Crafty.background('#fafaf2');
		Crafty.scene('Loading');
	};

	this.newGame = function () {
		//Crafty.scene('RollToSeeWhoGoesFirst');
		Crafty.scene('Game');
		Crafty.e('DisplayText').at(65, 315).text(this.turn + ' to move').bind('NewTurn', function () {
			this.text(Game.turn + ' to move');
		});
	};

	this.rollDice = function () {
		Crafty('Dice').destroy();
		this.dice = [];
		var di1 = 6;//Crafty.math.randomInt(1, 6);
		var di2 = 5;//Crafty.math.randomInt(1, 6);
		this.dice.push(di1);
		this.dice.push(di2);
		if (di1 == di2) { // handle doubles
			this.dice.push(di1);
			this.dice.push(di2);
		}
	};

	this.getPositionsPieceCouldMoveTo = function (fromPos) {
		var positionsPieceCouldMoveTo = [];

		var direction = this.turn == 'White' ? 1 : -1;

		for (var j = 0; j < this.dice.length; j++) {
			var endingPosition = fromPos + (direction * this.dice[j]);
			if (endingPosition < 0 || endingPosition > 23) {
				if (this.turn == 'White' && _.min(this.currentPositions) > 17) {
					positionsPieceCouldMoveTo.push(24);
				}
				else if (this.turn == 'Black' && _.max(this.currentPositions) < 6) {
					positionsPieceCouldMoveTo.push(-1);
				}
			}
			else {
				var endingPip = this.pips[endingPosition];
				if (endingPip.checkers.length < 2 || _.first(_.pluck(endingPip.checkers, 'side')) == this.turn) {
					positionsPieceCouldMoveTo.push(endingPosition);
				}
			}
		}
		return positionsPieceCouldMoveTo;
	};

	this.highlightPiecesThatCanMove = function () {
		var pieces = _.where(this.checkers, { side: this.turn });
		var anyHitPieces = _.where(pieces, { hit: true });
		if (anyHitPieces.length > 0) {
			pieces = anyHitPieces;
		}
		this.currentPositions = _.uniq(_.pluck(pieces, 'position'));

		for (var i = 0; i < this.currentPositions.length; i++) {
			var currentPosition = this.currentPositions[i];
			var positions = this.getPositionsPieceCouldMoveTo(currentPosition);
			if (positions.length > 0) {
				if (currentPosition < 24 && currentPosition > -1) {
					this.pips[currentPosition].activateChecker();
				}
				else {
					_.last(anyHitPieces).activate();
				}
			}
		}
	};

	this.addChecker = function (side, pos, hit) {
		hit = hit || false;
		var checker = Crafty.e(side);
		checker.position = pos;
		checker.side = side;
		checker.hit = hit;
		if (pos > -1 && pos < 24) {
			this.pips[pos].addChecker(checker);
			this.pips[pos].redraw = true;
		}
		this.checkers.push(checker);
	};

	this.removeChecker = function (pos) {
		if (pos > -1 && pos < 24) {
			this.pips[pos].redraw = true;
			this.pips[pos].removeChecker();
		}
		else {
			var checker = _.first(_.where(this.checkers, { position: pos, side: this.turn, active: true }));
			checker.destroy();
		}
		for (var i = 0; i < this.checkers.length; i++) {
			if (this.checkers[i].position == pos && this.checkers[i].active) { // remove the active checker at that pos
				this.checkers.splice(i, 1);
				break;
			}
		}
	}

	var movement = {
		checkerSelected: false,
		fromPosition: 0
	};

	this.hitChecker = function (atPos) {
		var moveToPos = 24;
		var side = 'Black';
		if (this.pips[atPos].checkers[0].side == 'White') {
			moveToPos = -1;
			side = 'White';
		}
		this.removeChecker(atPos);
		this.addChecker(side, moveToPos, true);
	};

	this.moveChecker = function (fromPos, toPos) {
		this.removeChecker(fromPos);
		movement.checkerSelected = false;

		if (toPos < 24 && toPos > -1) {
			if (this.pips[toPos].checkers.length == 1 && this.pips[toPos].checkers[0].side != this.turn) {
				this.hitChecker(toPos);
			}
			this.addChecker(this.turn, toPos);
			_.each(_.where(this.pips, { active: true }), function (pip) {
				pip.deactivate();
			});
		}
		else if (toPos == 24) {
			this.numberOfWhitePiecesOff++;
			this.whiteOff.deactivate();
			if (this.numberOfWhitePiecesOff == 15) {
				this.endGame();
			}
		}
		else if (toPos == -1) {
			this.numberOfBlackPiecesOff++;
			this.blackOff.deactivate();
			if (this.numberOfBlackPiecesOff == 15) {
				this.endGame();
			}
		}
		var rollValue = Math.abs(toPos - fromPos);  // might require more work if movement is to multiple dice value
		var index = _.indexOf(this.dice, rollValue);
		this.dice.splice(index, 1);

		for (var i = 0; i < Crafty(rollValue.toString()).length; i++) {
			if (Crafty(Crafty(rollValue.toString())[i]).alpha == 1) {
				Crafty(Crafty(rollValue.toString())[i]).alpha = 0.5;
				break;
			}
		}
		this.drawCheckers();
	};

	function drawHitPieces(checkers, x, yOffset, ySpacer) {
		var numOfCheckers = checkers.length;
		if (numOfCheckers > 5) {
			ySpacer = 250 / numOfCheckers;
		}
		for (var i = 0; i < numOfCheckers; i++) {
			checkers[i].attr({ x: x, z: 5 + i, y: yOffset + (ySpacer * i) });
		}
	}

	this.drawOffPieces = function () {
		Crafty('Off').destroy();
		for (var i = 0; i < this.numberOfWhitePiecesOff; i++) {
			Crafty.e('WhiteOff').at(0, 20 + (i * 10));
		}
		for (var i = 0; i < this.numberOfBlackPiecesOff; i++) {
			Crafty.e('BlackOff').at(0, 20 + (i * 10));
		}
	}

	this.drawCheckers = function () {
		for (var i = 0; i < this.pips.length; i++) {
			if (this.pips[i].redraw) {
				this.pips[i].drawCheckers();
				this.pips[i].redraw = false;
			}
		}

		var hitWhites = _.where(this.checkers, { position: -1, side: 'White' });
		drawHitPieces(hitWhites, 350, 600, -50);
		var hitBlacks = _.where(this.checkers, { position: 24, side: 'Black' });
		drawHitPieces(hitBlacks, 350, 0, 50);
		this.drawOffPieces();
	};

	this.gameOver = function () {
		Crafty.scene('GameOver');
	};

	this.takeTurn = function () {
		Crafty.trigger('NewTurn', null);
		this.rollDice();
		for (var i = 0; i < this.dice.length; i++) {
			Crafty.e(this.dice[i].toString()).at(435 + (i * 70), 305);
		}
		this.highlightPiecesThatCanMove();
		if (_.where(Game.checkers, { side: Game.turn, active: true }).length == 0) {
			this.endTurn();
		}
	};

	this.endTurn = function () {
		var pieces = _.where(this.checkers, {  side: this.turn });
		this.currentPositions = _.uniq(_.pluck(pieces, 'position'));
		if ((this.turn == 'White' && _.min(this.currentPositions) > 23) || (this.turn == 'Black' && _.max(this.currentPositions) < 0)) {
			this.gameOver();
		}
		else {
			this.turn = this.turn == 'White' ? 'Black' : 'White';
			this.takeTurn();
		}
	};

	this.endGame = function () {

	};

	Crafty.bind('MoveClicked', function (toPos) {
		Game.moveChecker(movement.fromPosition, toPos);
		if (Game.dice.length > 0) {
			Game.highlightPiecesThatCanMove();
			if (_.where(Game.checkers, { side: Game.turn, active: true }).length > 0) {
				return;
			}
		}
		Game.endTurn();
	});

	Crafty.bind('CheckerClicked', function (atPos) {
		if (movement.checkerSelected) {
			movement.checkerSelected = false;

			var positions = Game.getPositionsPieceCouldMoveTo(atPos);
			for (var i = 0; i < positions.length; i++) {
				if (positions[i] > 0 && positions[i] < 24) {
					Game.pips[positions[i]].deactivate();
				}
				else if (positions[i] > 23 && Game.turn == 'White') {
					Game.whiteOff.deactivate();
				}
				else if (positions[i] < 0 && Game.turn == 'Black') {
					Game.blackOff.deactivate();
				}
			}
			Game.highlightPiecesThatCanMove();
		}
		else {
			movement.checkerSelected = true;
			movement.fromPosition = atPos;
			for (var i = 0; i < Game.currentPositions.length; i++) {
				if (Game.currentPositions[i] != atPos) {
					Game.pips[Game.currentPositions[i]].deactivateChecker();
				}
			}
			var positions = Game.getPositionsPieceCouldMoveTo(atPos);
			for (var i = 0; i < positions.length; i++) {
				if (positions[i] > 0 && positions[i] < 24) {
					Game.pips[positions[i]].activate();
				}
				else if (positions[i] > 23 && Game.turn == 'White') {
					Game.whiteOff.activate();
				}
				else if (positions[i] < 0 && Game.turn == 'Black') {
					Game.blackOff.activate();
				}
			}
		}
	});
};
var Game = new game();