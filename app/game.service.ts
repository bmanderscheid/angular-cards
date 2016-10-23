import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { CardService } from '../app/card.service'

@Injectable()
export class GameService {

    private CARD_DATA_URL:string = '../assets/data/cards.json';

    constructor(private http: Http) { }

    private initServices():void{
        
    }

    loadCardData() {
        return this.http.get(this.CARD_DATA_URL)
            .toPromise()
            .then(response => response.json().cards as Card[])
    }

}