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
var game_service_1 = require('../app/game.service');
var GameComponent = (function () {
    function GameComponent(_gameService) {
        this._gameService = _gameService;
        this.FRAME_RATE = 1000 / 60;
        this.DECK_POS = new PIXI.Point(100, 100);
    }
    GameComponent.prototype.ngOnInit = function () {
        this.preparePIXI();
        this.loadAssets();
    };
    GameComponent.prototype.preparePIXI = function () {
        this._renderer = PIXI.autoDetectRenderer(1024, 768, { backgroundColor: 0x1099bb });
        document.getElementById("stage").appendChild(this._renderer.view);
        this._stage = new PIXI.Container();
        this._renderer.render(this._stage);
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
        this.startGameLoop();
    };
    GameComponent.prototype.startGameLoop = function () {
        var _this = this;
        setInterval(function () {
            _this._renderer.render(_this._stage);
        }, this.FRAME_RATE);
    };
    // GAME CONTROL
    GameComponent.prototype.drawCard = function () {
        var card = this._gameService.drawCard();
        var frame = PIXI.Texture.fromFrame(card.texture);
        var sprite = new PIXI.Sprite(frame);
        sprite.anchor.set(.5, .5);
        sprite.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(sprite);
        TweenLite.to(sprite, 1, { x: 512, y: 384, rotation: 180 * (Math.PI / 180) });
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