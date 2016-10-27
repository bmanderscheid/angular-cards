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
    private _hand: Card[];
    private _handPoints: number;
    private _dealerHand: Card[];

    private _currentPlayer: Observable<Player>;
    private _playerSubject: BehaviorSubject<Player>;

    private _disableMoves: boolean;

    constructor(private http: Http, private cardService: CardService) {
        this._hand = [];
        this._dealerHand = [];
        this._disableMoves = false;
        
        this._playerSubject = new BehaviorSubject<Player>(Player.PLAYER);
        this._currentPlayer = this._playerSubject.asObservable();
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
            hand = i % 2 == 0 ? this._hand : this._dealerHand;
            var cardIndex: number = Math.floor(Math.random() * (this._gameDeck.length - 1));
            var card: Card = this._gameDeck[cardIndex];
            card.player = i % 2 == 0 ? Player.PLAYER : Player.DEALER;
            card.flipped = i == hiddenCardIndex;
            this._gameDeck.splice(cardIndex, 1);
            hand.push(card);
            i++;
        }, 500);
    }

    hitCard(): void {
        if (this._disableMoves) return;
        let hand: Card[] = this._playerSubject.value == Player.PLAYER ? this._hand : this._dealerHand;
        var cardIndex: number = Math.floor(Math.random() * (this._gameDeck.length - 1));
        var card: Card = this._gameDeck[cardIndex];
        this._gameDeck.splice(cardIndex, 1);
        card.player = this._playerSubject.value;
        hand.push(card);
        this._disableMoves = true;
    }

    evaluateHand(): boolean {
        if (this.countCardPoints() < 21) {
            this._disableMoves = false;
            return true;
        }
        return false;
    }

    countCardPoints(): number {
        return this._hand.reduce((a: number, b: Card) => {
            return a + b.values[0];
        }, 0);
    }

    dealerGo(): void {        
        this._playerSubject.next(Player.DEALER);       
    }

    getCardModelByIndex(player:Player,index:number):Card{
        var hand:Card[] = player == Player.PLAYER ? this._hand : this._dealerHand;
        return hand[index];
    }

    //get set
    get gameDeck(): Card[] {
        return this._gameDeck;
    }

    get hand(): Card[] {
        return this._hand;
    }

    get dealerHand(): Card[] {
        return this._dealerHand;
    }

    get handPoints(): number {
        return this._handPoints;
    }

    get currentPlayer():Observable<Player>{
        return this._currentPlayer;
    }

}