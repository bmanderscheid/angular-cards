import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Card } from '../app/card.model'

@Injectable()
export class CardService {

    private CARD_DATA_URL:string = '../assets/data/cards.json';

    constructor(private http: Http) { }

    loadCardData() {
        return this.http.get(this.CARD_DATA_URL)
            .toPromise()
            .then(response => response.json().cards as Card[])
    }

}