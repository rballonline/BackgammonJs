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

Crafty.c('Pip', {
    init: function() {
        this.requires('Actor').attr({ h: 200, w: 50 });
    },
    whitePos: 0,
    blackPos: 0,
    setPos: function(pipPos) {
        this.whitePos = pipPos;
        this.blackPos = 21 - pipPos;
        if(pipPos < 6) {
            this.attr({ x: 50*(pipPos-1), y: 400 });
        }
        else if(pipPos > 5 && pipPos < 11) {
            this.attr({ x: 50*pipPos, y: 400});
        }
        else if(pipPos > 10 && pipPos < 16) {
            this.attr({ x: 50*this.blackPos, y: 10}).flip('Y');
        }
        else if(pipPos > 15) {
            this.attr({ x: 50*(this.blackPos-1), y: 10}).flip('Y');
        }
    }
});
Crafty.c('BlackPip', {
    init: function() {
        this.requires('Pip, spr_black_pip')
            .attr({ z: 2 });
    }
});
Crafty.c('WhitePip', {
    init: function() {
        this.requires('Pip, spr_white_pip')
            .attr({ z: 20 });
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
         this.requires('Actor');
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