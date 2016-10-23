import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Card } from '../app/card.model'
import { CardService } from '../app/card.service'

@Injectable()
export class GameService {

    private _gameDeck: Card[];

    constructor(private http: Http, private cardService: CardService) { }

    initServices(): void {
        // how do I tell the component that I'm ready?
        this.cardService.loadCardData()
            .then(cards => {
                this._gameDeck = cards;                
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error); // for demo purposes only
        return false;
    }

    drawCard(): Card {
        var cardIndex:number = Math.floor(Math.random() * (this._gameDeck.length - 1));
        var card:Card = this._gameDeck[cardIndex];
        this._gameDeck.splice(cardIndex,1); 
        console.log(this._gameDeck.length);
        return card;
    }

    get gameDeck():Card[]{
        return this._gameDeck;
    }

}