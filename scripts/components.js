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
    init: function() {
        for(var i = 1; i < 21; i++) { // drawBoard
            if(i%2 == 0) {
                Crafty.e('BlackPip').setPos(i);
            }
            else {
                Crafty.e('WhitePip').setPos(i);
            }
            var pip = Crafty.e('HighlightPip').setPos(i);
            this.pips.push(pip);
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
    checkers: [],
    setPos: function(pipPos) {
        this.whitePos = pipPos;
        this.blackPos = 21 - pipPos;
        if(pipPos < 6) {
            this.attr({ x: 50 * (pipPos - 1), y: 400 });
        }
        else if(pipPos > 5 && pipPos < 11) {
            this.attr({ x: 50 * pipPos, y: 400});
        }
        else if(pipPos > 10 && pipPos < 16) {
            this.attr({ x: 50 * this.blackPos, y: 0}).flip('Y');
        }
        else if(pipPos > 15) {
            this.attr({ x: 50 * (this.blackPos - 1), y: 0}).flip('Y');
        }
        return this;
    },
    drawCheckers: function() {
        var numOfCheckers = this.checkers.length;
        var ySpacer = 50;
        var yOffset = 0;
        if(this.whitePos > 10)
        {
            ySpacer *= -1;
            yOffset = 400;
        }
        for(var i = 0; i < numOfCheckers; i++) {
            if(numOfCheckers > 4) {
                ySpacer = 200 / numOfCheckers;
            }
            this.checkers[i].attr({ x: this.x, z: 5 + i, y: yOffset + (ySpacer * i) });
        }
    },
    addChecker: function(checker) {
        this.checkers.push(checker);
        this.drawCheckers();
    },
    removeChecker: function() {
        this.checkers.pop();
        this.drawCheckers();
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