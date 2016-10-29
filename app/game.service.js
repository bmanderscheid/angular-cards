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
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
require('rxjs/add/operator/toPromise');
var card_service_1 = require('../app/card.service');
var game_values_1 = require('../app/game-values');
var GameService = (function () {
    function GameService(http, cardService) {
        this.http = http;
        this.cardService = cardService;
        this._gameDeck = [];
        this._disableMoves = false;
        this._currentPlayerSource = new BehaviorSubject_1.BehaviorSubject(game_values_1.Player.PLAYER);
        this._currentPlayer = this._currentPlayerSource.asObservable();
        this._handSource = new BehaviorSubject_1.BehaviorSubject([]);
        this._hand = this._handSource.asObservable();
    }
    GameService.prototype.initServices = function () {
        var _this = this;
        // figure out how to return promise to game component so it can start render
        this.cardService.loadCardData()
            .then(function (cards) {
            _this._gameDeck = cards;
            _this.dealCards();
        })
            .catch(this.handleError);
    };
    GameService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // lazy        
    };
    GameService.prototype.dealCards = function () {
        var _this = this;
        var hand;
        var i = 0;
        var hiddenCardIndex = 1;
        var int = setInterval(function () {
            if (i == 3)
                clearInterval(int);
            var card = _this.drawCard();
            card.player = i % 2 == 0 ? game_values_1.Player.PLAYER : game_values_1.Player.DEALER;
            card.flipped = i == hiddenCardIndex;
            _this._handSource.value.push(card);
            _this._handSource.next(_this._handSource.value);
            i++;
        }, 500);
    };
    GameService.prototype.hitCard = function () {
        //if (this._disableMoves) return;
        var card = this.drawCard();
        card.player = this._currentPlayerSource.value;
        this._handSource.value.push(card);
        this._handSource.next(this._handSource.value);
        this.evaluateHand();
        //this._disableMoves = true;
    };
    //move to card service
    GameService.prototype.drawCard = function () {
        var cardIndex = Math.floor(Math.random() * (this._gameDeck.length - 1));
        var card = this._gameDeck[cardIndex];
        this._gameDeck.splice(cardIndex, 1);
        return card;
    };
    GameService.prototype.evaluateHand = function () {
        if (this._currentPlayerSource.value == game_values_1.Player.DEALER) {
            this.evaluateDealer();
        }
        else {
            this.evaluatePlayer();
        }
    };
    GameService.prototype.evaluateDealer = function () {
        var _this = this;
        var points = this.countPlayerPoints(game_values_1.Player.DEALER);
        if (points < 16) {
            TweenLite.delayedCall(1, function () { return _this.hitCard(); });
        }
        else if (points >= 16 && points <= 21) {
            this.gameOver();
        }
        else if (points > 21) {
            alert("dealer busted");
        }
    };
    GameService.prototype.evaluatePlayer = function () {
    };
    GameService.prototype.countPlayerPoints = function (player) {
        var hand = this._handSource.value.filter(function (card) { return card.player == player; });
        return hand.reduce(function (a, b) {
            return a + b.values[0];
        }, 0);
    };
    GameService.prototype.dealerGo = function () {
        this._handSource.value[0].flipped = false;
        this._currentPlayerSource.next(game_values_1.Player.DEALER);
        var delaerPoints = this.countPlayerPoints(game_values_1.Player.DEALER);
        this.evaluateHand();
    };
    GameService.prototype.getCardModelByIndex = function (player, index) {
        var hand = player == game_values_1.Player.PLAYER ? this._gameDeck : this._dealerHand;
        return hand[index];
    };
    GameService.prototype.gameOver = function () {
        var _this = this;
        TweenLite.delayedCall(1, function () { return _this.evaluateGame(); });
    };
    GameService.prototype.evaluateGame = function () {
        var playerPoints = this.countPlayerPoints(game_values_1.Player.PLAYER);
        var dealerPoints = this.countPlayerPoints(game_values_1.Player.DEALER);
        if (playerPoints > dealerPoints) {
            alert("player wins");
        }
        else if (dealerPoints > playerPoints) {
            alert("dealer wins");
        }
        else {
            alert("draw");
        }
    };
    Object.defineProperty(GameService.prototype, "hand", {
        //get set
        get: function () {
            return this._hand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "handPoints", {
        get: function () {
            return this._handPoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "currentPlayer", {
        get: function () {
            return this._currentPlayer;
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