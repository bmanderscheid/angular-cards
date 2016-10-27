"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var game_values_1 = require('../app/game-values');
var game_service_1 = require('../app/game.service');
var GameComponent = (function () {
    function GameComponent(_gameService) {
        var _this = this;
        this._gameService = _gameService;
        this.MOVE_DELAY = .3; //how long a move takes to animate
        //sprite positions
        this.DECK_POS = new PIXI.Point(100, 200);
        this.DEALER_Y = 200;
        this.PLAYER_Y = 400;
        this.FRAME_RATE = 1000 / 60;
        this._hand = [];
        this._dealerHand = [];
        this._gameService.currentPlayer.subscribe(function (newValue) { _this.changePlayer(newValue); });
    }
    GameComponent.prototype.ngOnInit = function () {
        this.preparePIXI();
        this.loadAssets();
    };
    GameComponent.prototype.preparePIXI = function () {
        this._renderer = PIXI.autoDetectRenderer(1024, 768, { backgroundColor: 0x1099bb });
        document.getElementById("stage").appendChild(this._renderer.view);
        this._stage = new PIXI.Container();
    };
    GameComponent.prototype.loadAssets = function () {
        var _this = this;
        this._loader = new PIXI.loaders.Loader('assets/');
        this._loader.add('frames.json');
        this._loader.load(function () { return _this.assetsLoaded(); });
    };
    GameComponent.prototype.assetsLoaded = function () {
        this.initServices();
    };
    GameComponent.prototype.initServices = function () {
        this._gameService.initServices();
        this.gameReady();
    };
    GameComponent.prototype.gameReady = function () {
        var cardBack = new PIXI.Sprite(PIXI.Texture.fromFrame("back"));
        cardBack.anchor.set(.5, .5);
        cardBack.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(cardBack);
        this._renderer.render(this._stage); // render initial sprites        
        this.startGameLoop();
    };
    GameComponent.prototype.startGameLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.update();
            _this.render();
        }, this.FRAME_RATE);
    };
    GameComponent.prototype.update = function () {
        for (var _i = 0, _a = this._gameService.hand; _i < _a.length; _i++) {
            var c = _a[_i];
            if (!c.rendered) {
                this.addCardToHand(c);
            }
        }
        for (var _b = 0, _c = this._gameService.dealerHand; _b < _c.length; _b++) {
            var c = _c[_b];
            if (!c.rendered) {
                this.addCardToHand(c);
            }
        }
    };
    GameComponent.prototype.render = function () {
        this.renderHand();
        this.renderDealerHand();
        this._renderer.render(this._stage);
    };
    GameComponent.prototype.renderHand = function () {
        if (this._hand.length < 1)
            return;
        var stageCenter = 512;
        var widthOfHand = this._hand.length * this._hand[0].width;
        var xPos = stageCenter - (widthOfHand / 2) + (this._hand[0].width / 2);
        for (var _i = 0, _a = this._hand; _i < _a.length; _i++) {
            var c = _a[_i];
            TweenLite.to(c, this.MOVE_DELAY, { x: xPos, y: this.PLAYER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    };
    GameComponent.prototype.renderDealerHand = function () {
        if (this._dealerHand.length < 1)
            return;
        var stageCenter = 512;
        var widthOfHand = this._dealerHand.length * this._dealerHand[0].width;
        var xPos = stageCenter - (widthOfHand / 2) + (this._dealerHand[0].width / 2);
        for (var _i = 0, _a = this._dealerHand; _i < _a.length; _i++) {
            var c = _a[_i];
            TweenLite.to(c, this.MOVE_DELAY, { x: xPos, y: this.DEALER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    };
    GameComponent.prototype.addCardToHand = function (cardModel) {
        var hand = cardModel.player == game_values_1.Player.PLAYER ? this._hand : this._dealerHand;
        var texture = cardModel.flipped ? "back" : cardModel.texture;
        var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(texture));
        sprite.texture = PIXI.Texture.fromFrame(texture);
        sprite.anchor.set(.5, .5);
        sprite.position.set(this.DECK_POS.x, this.DECK_POS.y);
        hand.push(sprite);
        this._stage.addChild(sprite);
        cardModel.rendered = true;
    };
    GameComponent.prototype.moveComplete = function () {
        var canHit = this._gameService.evaluateHand();
        if (!canHit) {
            alert("BUSTED");
        }
    };
    GameComponent.prototype.changePlayer = function (player) {
        console.log("change player");
        if (player == game_values_1.Player.PLAYER)
            return;
        //flip dealers hand
        var cardModel = this._gameService.getCardModelByIndex(game_values_1.Player.DEALER, 0);
        var texture = PIXI.Texture.fromFrame(cardModel.texture);
        this._dealerHand[0].texture = texture;
        console.log(cardModel);
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: 'game',
            templateUrl: 'app/game.template.html'
        }), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map