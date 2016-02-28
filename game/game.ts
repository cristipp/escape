/// <reference path="../lib/phaser.comments.d.ts" />
/// <reference path="../lib/lib.es6.d.ts" />

// http://www.photonstorm.com/phaser/advanced-phaser-and-typescript-projects

module Escape {

    import Point = Phaser.Point;
    import BitmapData = Phaser.BitmapData;
    export class Game extends Phaser.Game {
        constructor() {
            super(1024, 768, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);

            this.state.add(
                'entrance',
                new Room(
                    this.game,
                    'assets/1200px-Boca_Raton_Florida_private_beach_by_D_Ramey_Logan.jpg',
                    new Map([
                        ['west', 'dunk']
                    ])),
                false);
            this.state.add(
                'dunk',
                new Room(
                    this.game,
                    'assets/DUNK_-_Beachfront_Room_2nd_Floor_-_LowRes.JPG',
                    new Map([
                        ['east', 'entrance']
                    ])),
                false);
            this.state.start('Boot');
        }
    }

    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadBar', 'assets/loader.png');
        }

        create() {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.game.scale.pageAlignHorizontally = true;
            }
            else {
                //  Same goes for mobile settings.
            }

            this.game.state.start('Preloader', true, false);
        }
    }

    export class Preloader extends Phaser.State {
        preloadBar: Phaser.Sprite;

        preload() {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('titlepage', 'assets/3706644444_c6daf9453a_b.jpg');
        }

        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu() {
            //this.game.state.start('MainMenu', true, false);
            this.game.state.start('entrance', true, false);
        }
    }

    export class MainMenu extends Phaser.State {
        background: Phaser.Sprite;
        logo: Phaser.Sprite;

        create() {
            this.background = this.add.sprite(
                this.game.world.centerX,
                this.game.world.centerY,
                'titlepage');
            this.background.alpha = 0;
            this.background.anchor.set(0.5);

            var menu = this.game.add.group();
            menu.position = new Phaser.Point(
                this.game.world.centerX,
                this.game.world.centerY
            );
            var play = this.addButton("Play", this.startGame);
            var newGame = this.addButton("New Game", this.startGame);
            menu.add(play);
            menu.add(newGame);
            this.vstack([play, newGame], 10);

            // this.vstack([play, newGame], 10);

            this.add.tween(this.background).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(play).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(newGame).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
        }

        addButton(text: string, listener: Function) {
            var button = this.game.add.text(
                0,
                0,
                text,
                { font: "65px Arial", fill: "#ff0044", align: "center" });
            button.anchor.set(0.5, 0);
            button.alpha = 0;
            button.inputEnabled = true;
            button.input.useHandCursor = true;
            button.events.onInputDown.addOnce(listener, this);
            return button
        }

        vstack(sprites: Phaser.Sprite[], spacing: number) {
            var heights = sprites.map(s => s.height);
            var height = heights.reduce((a, b) => a + b) + (sprites.length - 1) * spacing;
            sprites.reduce(
                (y, s) => {
                    s.position = new Phaser.Point(s.position.x, y);
                    return y + s.height + spacing
                },
                - height / 2
            )
        }

        fadeOut() {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('entrance', true, false);
        }
    }

    export class Room extends Phaser.State {
        game: Phaser.Game;
        path: string;
        neighbors: Map<string, string>;
        navbarThickness = 30;

        constructor(game: Phaser.Game, path: string, neighbors: Map<string, string>) {
            this.game = game;
            this.path = path;
            this.neighbors = neighbors;
        }

        preload() {
            this.load.image(this.key, this.path);
        }


        create() {
            background = this.game.add.sprite(this.world.centerX, this.world.centerY, this.key);
            background.anchor.set(0.5);
            this.neighbors.forEach((roomName, dir) => {
                switch(dir) {
                    case 'north':
                        this.northNavbar(roomName);
                        break;
                    case 'east':
                        this.eastNavbar(roomName);
                        break;
                    case 'south':
                        this.southNavbar(roomName);
                        break;
                    case 'west':
                        this.westNavbar(roomName);
                        break;
                    default:
                        throw new Error("bad dir")
                }
            });

            this.westNavbar('dunk');
        }

        northNavbar(roomName) {
            this.navbar('north', 0, 0, this.game.width, this.navbarThickness, roomName);
        }

        eastNavbar(roomName) {
            this.navbar('east', this.game.width - this.navbarThickness, 0, this.game.width, this.game.height, roomName);
        }

        southNavbar(roomName) {
            this.navbar('south', 0, this.game.height - this.navbarThickness, this.game.width, this.game.height, roomName);
        }

        westNavbar(roomName) {
            this.navbar('west', 0, 0, this.navbarThickness, this.game.height, roomName);
        }

        navbar(key, x, y, width, height, roomName) {
            bitmap = this.game.add.bitmapData(width, height);
            bitmap.context.fillStyle = '#000077';
            bitmap.context.fillRect(0, 0, bitmap.width, bitmap.height);
            bitmap.generateTexture(key);
            return this.game.add.button(x, y, key, () => this.click(roomName), this, 1, 0, 2);
        }

        click(roomName) {
            console.log(this.key, roomName);
            this.game.state.start(roomName)
        }
    }
}

window.onload = () => {
    var game = new Escape.Game();
};