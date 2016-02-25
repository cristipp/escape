/// <reference path="../lib/phaser.comments.d.ts" />
/// <reference path="../lib/lib.es6.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// http://www.photonstorm.com/phaser/advanced-phaser-and-typescript-projects
var Escape;
(function (Escape) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 1024, 768, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('entrance', new Room(this.game, 'assets/1200px-Boca_Raton_Florida_private_beach_by_D_Ramey_Logan.jpg'), false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Escape.Game = Game;
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.game.scale.pageAlignHorizontally = true;
            }
            else {
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Escape.Boot = Boot;
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('titlepage', 'assets/3706644444_c6daf9453a_b.jpg');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Escape.Preloader = Preloader;
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'titlepage');
            this.background.alpha = 0;
            this.background.anchor.set(0.5);
            var menu = this.game.add.group();
            menu.position = new Phaser.Point(this.game.world.centerX, this.game.world.centerY);
            var play = this.addButton("Play", this.startGame);
            var newGame = this.addButton("New Game", this.startGame);
            menu.add(play);
            menu.add(newGame);
            this.vstack([play, newGame], 10);
            // this.vstack([play, newGame], 10);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(play).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(newGame).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
        };
        MainMenu.prototype.addButton = function (text, listener) {
            var button = this.game.add.text(0, 0, text, { font: "65px Arial", fill: "#ff0044", align: "center" });
            button.anchor.set(0.5, 0);
            button.alpha = 0;
            button.inputEnabled = true;
            button.input.useHandCursor = true;
            button.events.onInputDown.addOnce(listener, this);
            return button;
        };
        MainMenu.prototype.vstack = function (sprites, spacing) {
            var heights = sprites.map(function (s) { return s.height; });
            var height = heights.reduce(function (a, b) { return a + b; }) + (sprites.length - 1) * spacing;
            sprites.reduce(function (y, s) {
                s.position = new Phaser.Point(s.position.x, y);
                return y + s.height + spacing;
            }, -height / 2);
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('entrance', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Escape.MainMenu = MainMenu;
    var Direction;
    (function (Direction) {
        Direction[Direction["NORTH"] = 0] = "NORTH";
        Direction[Direction["SOUTH"] = 1] = "SOUTH";
        Direction[Direction["WEST"] = 2] = "WEST";
        Direction[Direction["EAST"] = 3] = "EAST";
    })(Direction || (Direction = {}));
    var Navbar = (function (_super) {
        __extends(Navbar, _super);
        function Navbar(game, key, width, height) {
            _super.call(this, game, key, width, height);
            this.context.fillStyle = '#000077';
            this.context.fillRect(0, 0, width, height);
        }
        return Navbar;
    })(Phaser.BitmapData);
    Escape.Navbar = Navbar;
    var Room = (function (_super) {
        __extends(Room, _super);
        function Room(game, path, neighbors) {
            this.game = game;
            this.path = path;
            this.neighbors = neighbors;
        }
        Room.prototype.preload = function () {
            this.load.image(this.key, this.path);
        };
        Room.prototype.create = function () {
            this.game.add.sprite(0, 0, this.key);
            var bar = new Navbar(this.game, 'north', this.game.width, 30);
            this.game.add.sprite(0, 0, bar);
        };
        return Room;
    })(Phaser.State);
    Escape.Room = Room;
})(Escape || (Escape = {}));
window.onload = function () {
    var game = new Escape.Game();
};
//# sourceMappingURL=game.js.map