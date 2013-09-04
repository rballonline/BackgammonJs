Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas');
  },
  at: function (x, y) {
  	this.x = x;
  	this.y = y;
  	return this;
  }
});

Crafty.c('1', {
    init: function() {
        this.requires('Actor, spr_1')
            .attr({ z: 5, h: 50, w: 50 });
    }
});
Crafty.c('2', {
    init: function() {
        this.requires('Actor, spr_2')
            .attr({ z: 5, h: 50, w: 50 });
    }
});
Crafty.c('3', {
    init: function() {
        this.requires('Actor, spr_3')
            .attr({ z: 5, h: 50, w: 50 });
    }
});
Crafty.c('4', {
    init: function() {
        this.requires('Actor, spr_4')
            .attr({ z: 5, h: 50, w: 50 });
    }
});
Crafty.c('5', {
    init: function() {
        this.requires('Actor, spr_5')
            .attr({ z: 5, h: 50, w: 50 });
    }
});
Crafty.c('6', {
    init: function() {
        this.requires('Actor, spr_6')
            .attr({ z: 5, h: 50, w: 50 });
    }
});

Crafty.c('Board', {
    pips: [],
    blackCheckers: [],
    whiteCheckers: [],
    activeChecker: null,
    init: function() {
        for(var i = 0; i < 24; i++) { // drawBoard
            var pip;
            if(i%2 == 0) {
                pip = Crafty.e('BlackPip').setPos(i);
            }
            else {
                pip = Crafty.e('WhitePip').setPos(i);
            }
            this.pips.push(pip);
        }
    },
    addChecker: function(side, pos) {
        var checker = Crafty.e(side);
        checker.pipPosition = pos;
        this.pips[pos].addChecker(checker);
        if(side == 'WhiteChecker') {
            this.whiteCheckers.push(checker);
        }
        else {
            this.blackCheckers.push(checker);
        }
    },
    moveChecker: function(fromPos, toPos) {
        var checker = this.pips[fromPos].removeChecker();
        if(toPos < 24) {
            this.pips[toPos].addChecker(checker);
        }
        else {
            // move off board
        }
        this.drawCheckers();
    },
    drawCheckers: function() {
        for(var i = 0; i < this.pips.length; i++) {
            if(this.pips[i].redraw) {
                this.pips[i].drawCheckers();
                this.pips[i].redraw = false;
            }
        }
    },
    highlightPieces: function(turn, dice) {
        var piecesMoving = this.whiteCheckers;
        var piecesDefending = this.blackCheckers;
        var direction = 1;
        if(turn == 'Black'){
            piecesMoving = this.blackCheckers;
            piecesDefending = this.whiteCheckers;
            direction = -1;
        }
        var potentialPositions = _.uniq(_.pluck(piecesMoving, 'pipPosition')); // loving underscore right about now

        for(var i = 0; i < potentialPositions.length; i++) {
            var currentPosition = potentialPositions[i];
            for(var j = 0; j < dice.length; j++) {
                var endingPosition = currentPosition + dice[j];
                if(endingPosition > 23) {
                    if(turn == 'White' && _.min(potentialPositions) > 17) {
                        //board.activateWhiteBar();
                    }
                    else if(turn == 'Black' && _.max(potentialPositions) < 6) {
                        //board.activateBlackBar();
                    }
                }
                else {
                    var endingPip = this.pips[endingPosition];
                    if(endingPip.checkers.length < 2) {
                        this.pips[currentPosition].activateChecker();
                    }
                }
            }
        }
    }
});

Crafty.c('Pip', {
    init: function() {
        this.requires('Actor').attr({ h: 200, w: 50, z: 4 });
        this.checkers = [];
    },
    blackPos: 0,
    redraw: false,
    checkers: [],
    setPos: function(pipPos) {
        this.whitePos = pipPos;
        this.blackPos = 23 - pipPos;
        if(pipPos < 6) {
            this.attr({ x: 50 * (pipPos), y: 400 });
        }
        else if(pipPos > 5 && pipPos < 12) {
            this.attr({ x: 50 * (pipPos + 1), y: 400});
        }
        else if(pipPos > 11 && pipPos < 17) {
            this.attr({ x: 50 * (this.blackPos + 1), y: 0}).flip('Y');
        }
        else if(pipPos > 16) {
            this.attr({ x: 50 * this.blackPos, y: 0}).flip('Y');
        }
        Crafty.e('DisplayText').attr({x: this.x, y: pipPos < 12 ? this.y + 187 : this.y}).textFont({ size: '10px'}).text(this.whitePos + '    (' + this.blackPos + ')');
        return this;
    },
    drawCheckers: function() {
        var numOfCheckers = this.checkers.length;
        var ySpacer = 50;
        var yOffset = 0;
        if(numOfCheckers > 4) {
            ySpacer = 200 / numOfCheckers;
        }
        if(this.whitePos < 12)
        {
            ySpacer *= -1;
            yOffset = 550;
        }
        for(var i = 0; i < numOfCheckers; i++) {
            console.log('x: ' + this.x + ' y: ' + (yOffset + (ySpacer * i)));
            this.checkers[i].attr({ x: this.x, z: 5 + i, y: yOffset + (ySpacer * i) });
        }
    },
    activateChecker: function() {
        var checker = _.last(this.checkers);
        checker.activate();
    },
    deactivateChecker: function(checker) {
        this.checkers.pop(); // remove highlight
        this.checkers.push(checker);
    },
    addChecker: function(checker) {
        this.checkers.push(checker);
        this.redraw = true;
    },
    removeChecker: function() {
        var checker = this.checkers.pop();
        this.redraw = true;
    }
});
Crafty.c('BlackPip', {
    init: function() {
        this.requires('Pip, spr_black_pip');
    }
});
Crafty.c('WhitePip', {
    init: function() {
        this.requires('Pip, spr_white_pip');
    }
});

Crafty.c('Checker', {
    pipPosition: 0,
    side: 'White',
    init: function() {
        this.requires('Actor, SpriteAnimation').attr({ h: 50, w: 50 });
    },
    activate: function () {
        this.animate('ActivateChecker', 1, 0, 1).animate('ActivateChecker', 1, 1);
    },
    deactivate: function() {
        this.animate('ActivateChecker', 0, 0, 0).animate('ActivateChecker', 1, 1);
    }
});
Crafty.c('WhiteChecker', {
    init: function() {
        this.requires('Checker, spr_white');
    }
});
Crafty.c('BlackChecker', {
    init: function() {
        this.requires('Checker, spr_black');
        this.side = 'Black';
    }
});

Crafty.c('DisplayText', {
	init: function() {
		this.requires('2D, DOM, Text, Tween')
			.textFont({ size: '30px', type: 'normal', family: 'Consolas' })
			.textColor('#000000')
			.attr({ w: Game.width, h: 80, z: 101 })
			.css('text-align: center');
	},
	at: function(y) {
		this.attr({y: y});
		return this;
	}
});