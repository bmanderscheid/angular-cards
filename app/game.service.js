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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var card_service_1 = require('../app/card.service');
var GameService = (function () {
    function GameService(http, cardService) {
        this.http = http;
        this.cardService = cardService;
    }
    GameService.prototype.initServices = function () {
        var _this = this;
        // how do I tell the component that I'm ready?
        this.cardService.loadCardData()
            .then(function (cards) {
            _this._gameDeck = cards;
        })
            .catch(this.handleError);
    };
    GameService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return false;
    };
    GameService.prototype.drawCard = function () {
        var cardIndex = Math.floor(Math.random() * (this._gameDeck.length - 1));
        var card = this._gameDeck[cardIndex];
        this._gameDeck.splice(cardIndex, 1);
        console.log(this._gameDeck.length);
        return card;
    };
    Object.defineProperty(GameService.prototype, "gameDeck", {
        get: function () {
            return this._gameDeck;
        },
        enumerable: true,
        configurable: true
    });
    GameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, card_service_1.CardService])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map