import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Card } from '../app/card.model'
import { CardService } from '../app/card.service'
import { Player } from '../app/game-values';


@Injectable()
export class GameService {

    private _gameDeck: Card[];

    private _hand: Observable<Array<Card>>;
    private _handSource: BehaviorSubject<Array<Card>>;

    private _handPoints: number;
    private _dealerHand: Card[];

    private _currentPlayer: Observable<Player>;
    private _currentPlayerSource: BehaviorSubject<Player>;



    private _disableMoves: boolean;

    constructor(private http: Http, private cardService: CardService) {
        this._gameDeck = [];
        this._disableMoves = false;

        this._currentPlayerSource = new BehaviorSubject<Player>(Player.PLAYER);
        this._currentPlayer = this._currentPlayerSource.asObservable();

        this._handSource = new BehaviorSubject<Array<Card>>([]);
        this._hand = this._handSource.asObservable();
    }

    initServices(): void {
        // figure out how to return promise to game component so it can start render
        this.cardService.loadCardData()
            .then(cards => {
                this._gameDeck = cards;
                this.dealCards();
            })
            .catch(this.handleError);
    }

    private handleError(error: any): void {
        console.error('An error occurred', error); // lazy        
    }

    dealCards(): void {
        var hand: Card[];
        var i: number = 0;
        let hiddenCardIndex: number = 1;
        let int = setInterval(() => {
            if (i == 3) clearInterval(int)
            let card: Card = this.drawCard();
            card.player = i % 2 == 0 ? Player.PLAYER : Player.DEALER;
            card.flipped = i == hiddenCardIndex;
            this._handSource.value.push(card);
            this._handSource.next(this._handSource.value);
            i++;
        }, 500);
    }

    hitCard(): void {
        //if (this._disableMoves) return;
        var card: Card = this.drawCard();
        card.player = this._currentPlayerSource.value;
        this._handSource.value.push(card);
        this._handSource.next(this._handSource.value);
        this.evaluateHand();
        //this._disableMoves = true;
    }

    //move to card service
    drawCard(): Card {
        let cardIndex: number = Math.floor(Math.random() * (this._gameDeck.length - 1));
        let card: Card = this._gameDeck[cardIndex];
        this._gameDeck.splice(cardIndex, 1);
        return card;
    }

    evaluateHand(): void {
        if (this._currentPlayerSource.value == Player.DEALER) {
            this.evaluateDealer();
        }
        else {
            this.evaluatePlayer();
        }
    }

    evaluateDealer(): void {
        let points: number = this.countPlayerPoints(Player.DEALER);
        if (points < 16) {
            TweenLite.delayedCall(1, () => this.hitCard());
        }
        else if (points >= 16 && points <= 21) {
            this.gameOver();
        }
        else if (points > 21) {
            alert("dealer busted");
        }
    }

    evaluatePlayer(): void {

    }

    countPlayerPoints(player:Player): number {
        var hand: Card[] = this._handSource.value.filter(
            card => card.player == player);
        return hand.reduce((a: number, b: Card) => {
            return a + b.values[0];
        }, 0);
    }

    dealerGo(): void {
        this._handSource.value[0].flipped = false;
        this._currentPlayerSource.next(Player.DEALER);
        let delaerPoints = this.countPlayerPoints(Player.DEALER);
        this.evaluateHand();
    }

    getCardModelByIndex(player: Player, index: number): Card {
        var hand: Card[] = player == Player.PLAYER ? this._gameDeck : this._dealerHand;
        return hand[index];
    }

    gameOver(){
        TweenLite.delayedCall(1,()=>this.evaluateGame());
    }

    evaluateGame(){
        var playerPoints:number = this.countPlayerPoints(Player.PLAYER);
        var dealerPoints:number = this.countPlayerPoints(Player.DEALER);
        if(playerPoints > dealerPoints){
            alert("player wins");
        }
        else if(dealerPoints > playerPoints){
            alert("dealer wins");
        }
        else{
            alert("draw");
        }
    }

    //get set


    get hand(): Observable<Card[]> {
        return this._hand;
    }

    get handPoints(): number {
        return this._handPoints;
    }

    get currentPlayer(): Observable<Player> {
        return this._currentPlayer;
    }

}