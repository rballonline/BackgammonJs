

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
    init: function() {
        for(var i = 0; i < 24; i++) { // drawBoard
            var pip;
            if(i%2 == 0) {
                pip = Crafty.e('BlackPip').setPos(i);
            }
            else {
                pip = Crafty.e('WhitePip').setPos(i);
            }
            Game.pips.push(pip);
        }
    }
});

Crafty.c('Pip', {
    init: function() {
        this.requires('Actor, SpriteAnimation, Mouse').attr({ h: 200, w: 50, z: 4 });
        this.checkers = [];
    },
    position: 0,
    blackPos: 0,
    redraw: false,
    active: false,
    checkers: [],
    setPos: function(pipPos) {
        this.position = pipPos;
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
        return this;
    },
    drawCheckers: function() {
        var numOfCheckers = this.checkers.length;
        var ySpacer = 50;
        var yOffset = 0;
        if(numOfCheckers > 5) {
            ySpacer = 250 / numOfCheckers;
        }
        if(this.position < 12) {
            ySpacer *= -1;
            yOffset = 625;
        }
        for(var i = 0; i < numOfCheckers; i++) {
            this.checkers[i].attr({ x: this.x, z: 5 + i, y: yOffset + (ySpacer * i) });
        }
    },
    activateChecker: function() {
        var checker = _.last(this.checkers);
        checker.activate();
    },
    deactivateChecker: function() {
        var checker = _.last(this.checkers);
        checker.deactivate();
    },
    addChecker: function(checker) {
        this.checkers.push(checker);
        this.redraw = true;
    },
    removeChecker: function() {
        var checker = this.checkers.pop();
        checker.destroy();
        this.redraw = true;
    },
    activate: function () {
        this.animate('ActivatePip', 1, 0, 1).animate('ActivatePip', 1, 1);
        this.bind('Click', function() {
            Crafty.trigger('PipClicked', this.position);
        });
        this.active = true;
    },
    deactivate: function() {
        this.animate('ActivatePip', 0, 0, 0).animate('ActivatePip', 1, 1);
        this.unbind('Click');
        this.active = true;
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
    position: 0,
    side: 'White',
    init: function() {
        this.requires('Actor, Mouse, SpriteAnimation').attr({ h: 50, w: 50 });

    },
    activate: function () {
        this.animate('ActivateChecker', 1, 0, 1).animate('ActivateChecker', 1, 1);
        this.bind('Click', function() {
            Crafty.trigger('CheckerClicked', this.position);
        });
    },
    deactivate: function() {
        this.animate('ActivateChecker', 0, 0, 0).animate('ActivateChecker', 1, 1);
        this.unbind('Click');
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