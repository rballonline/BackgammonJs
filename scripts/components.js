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
    dice: [],
    activeChecker: null,
    init: function() {
        for(var i = 1; i < 25; i++) { // drawBoard
            if(i%2 == 0) {
                Crafty.e('BlackPip').setPos(i);
            }
            else {
                Crafty.e('WhitePip').setPos(i);
            }
            var pip = Crafty.e('HighlightPip').setPos(i);
            this.pips.push(pip);
        }
    },
    moveChecker: function(fromPos, toPos) {
        var checker = this.pips[fromPos-1].removeChecker();
        if(toPos < 25) {
            this.pips[toPos-1].addChecker(checker);
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
    rollDice: function() {
        var di1 = Crafty.math.randomInt(1,6);
        var di2 = Crafty.math.randomInt(1,6);
        this.dice.push(di1);
        this.dice.push(di2);
        if(di1 == di2) { // handle doubles
            this.dice.push(di1);
            this.dice.push(di2);
        }
    },
    highlightPieces: function(whiteTurn) {
        for(var i = 0; i < this.pips.length; i++) {
            var pip = this.pips[i];
            if(pip.checkers.length > 0) {
                if(whiteTurn) {

                }
                else {

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
    whitePos: 0,
    blackPos: 0,
    redraw: false,
    checkers: [],
    setPos: function(pipPos) {
        this.whitePos = pipPos;
        this.blackPos = 25 - pipPos;
        if(pipPos < 7) {
            this.attr({ x: 50 * (pipPos - 1), y: 400 });
        }
        else if(pipPos > 6 && pipPos < 13) {
            this.attr({ x: 50 * pipPos, y: 400});
        }
        else if(pipPos > 12 && pipPos < 18) {
            this.attr({ x: 50 * this.blackPos, y: 0}).flip('Y');
        }
        else if(pipPos > 17) {
            this.attr({ x: 50 * (this.blackPos - 1), y: 0}).flip('Y');
        }
        Crafty.e('DisplayText').attr({x: this.x, y: pipPos < 13 ? this.y + 187 : this.y}).textColor('#000000').textFont({ size: '10px'}).text(this.whitePos + '    (' + this.blackPos + ')');
        return this;
    },
    drawCheckers: function() {
        var numOfCheckers = this.checkers.length;
        var ySpacer = 50;
        var yOffset = 0;
        if(numOfCheckers > 4) {
            ySpacer = 200 / numOfCheckers;
        }
        if(this.whitePos < 13)
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
        var activeChecker = this.checkers.pop();
        this.checkers.push(Crafty.e('HighlightChecker'));
        return activeChecker;
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
Crafty.c('HighlightPip', {
    init: function() {
        this.requires('Pip, spr_highlight_pip')
            .attr({ z: 20 });
        this.alpha = .4;
        this.visible = false;
    }
});

Crafty.c('Checker', {
    init: function() {
        this.requires('Actor').attr({ h: 50, w: 50 });
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
    }
});
Crafty.c('HighlightChecker', {
    init: function() {
        this.requires('Checker, spr_highlight');
    }
});

Crafty.c('DisplayText', {
	init: function() {
		this.requires('2D, DOM, Text, Tween')
			.textFont({ size: '30px', type: 'normal', family: 'Consolas' })
			.textColor('#ffffff')
			.attr({ w: Game.width, h: 80, z: 101 })
			.css('text-align: center');
	},
	at: function(y) {
		this.attr({y: y});
		return this;
	}
});