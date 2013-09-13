Crafty.c('Actor', {
	init: function () {
		this.requires('2D, Canvas');
	},
	at: function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
});

Crafty.c('1', {
	init: function () {
		this.requires('Actor, spr_1, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});
Crafty.c('2', {
	init: function () {
		this.requires('Actor, spr_2, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});
Crafty.c('3', {
	init: function () {
		this.requires('Actor, spr_3, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});
Crafty.c('4', {
	init: function () {
		this.requires('Actor, spr_4, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});
Crafty.c('5', {
	init: function () {
		this.requires('Actor, spr_5, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});
Crafty.c('6', {
	init: function () {
		this.requires('Actor, spr_6, Dice')
			.attr({ z: 5, h: 50, w: 50 });
	}
});

Crafty.c('OffBar', {
	init: function () {
		this.requires('Actor, spr_off').attr({ h: 50, w: 50 });
	}
});
Crafty.c('Bar', {
	init: function () {
		this.requires('Actor, spr_bar').attr({ h: 50, w: 56 });
	}
});

Crafty.c('Board', {
	init: function () {
		_(13).times(function (i) {
			Crafty.e('OffBar').at(0, i * 50);
			Crafty.e('Bar').at(350, i * 50);
		});
		for (var i = 0; i < 24; i++) { // drawBoard
			var pip = i % 2 == 0 ? Crafty.e('BlackPip').setPos(i) : Crafty.e('WhitePip').setPos(i);
			Game.pips.push(pip);
		}
	}
});

Crafty.c('Pip', {
	init: function () {
		this.requires('Actor, SpriteAnimation, Mouse').attr({ h: 200, w: 50, z: 4 });
		this.checkers = [];
	},
	position: 0,
	blackPos: 0,
	redraw: false,
	active: false,
	checkers: [],
	setPos: function (pipPos) {
		var barWidth = 50, bothWidth = 56;
		this.position = pipPos;
		this.blackPos = 23 - pipPos;
		if (pipPos < 6) {
			this.attr({ x: barWidth + 50 * (pipPos), y: 375 });
		}
		else if (pipPos > 5 && pipPos < 12) {
			this.attr({ x: bothWidth + 50 * (pipPos + 1), y: 375});
		}
		else if (pipPos > 11 && pipPos < 18) {
			this.attr({ x: bothWidth + 50 * (this.blackPos + 1), y: 0}).flip('Y');
		}
		else if (pipPos > 17) {
			this.attr({ x: barWidth + 50 * this.blackPos, y: 0}).flip('Y');
		}
		return this;
	},
	drawCheckers: function () {
		var numOfCheckers = this.checkers.length;
		var ySpacer = 50;
		var yOffset = 0;
		if (numOfCheckers > 5) {
			ySpacer = 250 / numOfCheckers;
		}
		if (this.position < 12) {
			ySpacer *= -1;
			yOffset = 600;
		}
		for (var i = 0; i < numOfCheckers; i++) {
			this.checkers[i].attr({ x: this.x, z: 5 + i, y: yOffset + (ySpacer * i) });
		}
	},
	activateChecker: function () {
		var checker = _.last(this.checkers);
		checker.activate();
	},
	deactivateChecker: function () {
		var checker = _.last(this.checkers);
		checker.deactivate();
	},
	addChecker: function (checker) {
		this.checkers.push(checker);
		this.redraw = true;
	},
	removeChecker: function () {
		var checker = this.checkers.pop();
		checker.destroy();
		this.redraw = true;
	},
	activate: function () {
		if (!this.active) {
			this.animate('ActivatePip', 1, 0, 1).animate('ActivatePip', 1, 1);
			this.bind('Click', function () {
				Crafty.trigger('MoveClicked', this.position);
			});
			for (var i = 0; i < this.checkers.length; i++) {   // bind all the checkers on the pip too
				this.checkers[i].bind('Click', function () {
					Crafty.trigger('MoveClicked', this.position);
				});
			}
			this.active = true;
		}
	},
	deactivate: function () {
		if (this.active) {
			this.animate('ActivatePip', 0, 0, 0).animate('ActivatePip', 1, 1);
			this.unbind('Click');
			for (var i = 0; i < this.checkers.length; i++) {
				this.checkers[i].unbind('Click');
			}
			this.active = false;
		}
	}
});
Crafty.c('BlackPip', {
	init: function () {
		this.requires('Pip, spr_black_pip');
	}
});
Crafty.c('WhitePip', {
	init: function () {
		this.requires('Pip, spr_white_pip');
	}
});

Crafty.c('Checker', {
	position: 0,
	side: 'White',
	active: false,
	hit: false,
	init: function () {
		this.requires('Actor, Mouse, SpriteAnimation').attr({ h: 50, w: 50 });

	},
	activate: function () {
		if (!this.active) {
			this.animate('ActivateChecker', 1, 0, 1).animate('ActivateChecker', 1, 1);
			this.bind('Click', function () {
				Crafty.trigger('CheckerClicked', this.position);
			});
			this.active = true;
		}
	},
	deactivate: function () {
		if (this.active) {
			this.animate('ActivateChecker', 0, 0, 0).animate('ActivateChecker', 1, 1);
			this.unbind('Click');
			this.active = false;
		}
	}
});
Crafty.c('White', {
	init: function () {
		this.requires('Checker, spr_white');
	}
});
Crafty.c('Black', {
	init: function () {
		this.requires('Checker, spr_black');
		this.side = 'Black';
	}
});

Crafty.c('DisplayText', {
	init: function () {
		this.requires('2D, DOM, Text')
			.textFont({ size: '30px', type: 'normal', family: 'Consolas' })
			.textColor('#000000')
			.attr({ w: Game.width, h: 80, z: 101 })
			.css('text-align: center');
	},
	at: function (x, y) {
		this.attr({x: x, y: y});
		return this;
	}
});

Crafty.c("OffBox", {
	active: false,
	position: 24,
	init: function () {
		this.requires('Actor, Mouse, Color').attr({ h: 150, w: 50, x: 0, y: 20, z: 5 });
		this.color("#F3D52C");
		this.alpha = 0;
	},
	activate: function () {
		this.alpha = 0.5;
		this.active = true;
		this.bind('Click', function () {
			Crafty.trigger('MoveClicked', this.position);
		});
	},
	deactivate: function () {
		this.alpha = 0;
		this.active = false;
		this.unbind('Click');
	}
});

Crafty.c('WhiteOff', {
	init: function () {
		this.requires('Actor, Off, spr_white_off').attr({ h: 10, w: 50, x: 0, z: 5 });
	}
});
Crafty.c('BlackOff', {
	init: function () {
		this.requires('Actor, Off, spr_black_off').attr({ h: 10, w: 50, x: 0, z: 5 });
	}
});