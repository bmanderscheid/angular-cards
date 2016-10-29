import { Component, OnInit } from '@angular/core';

import { Card } from '../app/card.model'
import { CardSprite } from '../app/card.sprite';
import { Player } from '../app/game-values'
import { GameService } from '../app/game.service'

@Component({
    selector: 'game',
    templateUrl: 'app/game.template.html'
})
export class GameComponent implements OnInit {

    private _stage: PIXI.Container;
    private _renderer: PIXI.SystemRenderer;
    private _loader: PIXI.loaders.Loader;

    private _allCards: Card[];

    private _playerHand: CardSprite[];
    private _dealerHand: CardSprite[];

    private FRAME_RATE: number;
    private MOVE_DELAY: number = .3; //how long a move takes to animate

    //sprite positions
    private DECK_POS: PIXI.Point = new PIXI.Point(100, 200);
    private DEALER_Y: number = 200;
    private PLAYER_Y: number = 400;


    constructor(private _gameService: GameService) {
        this.FRAME_RATE = 1000 / 60;
        this._playerHand = [];
        this._dealerHand = [];
        this._gameService.currentPlayer.subscribe((newValue: Player) => { this.playerChanged(newValue) });
        this._gameService.hand.subscribe((hand: Card[]) => {
            this._allCards = hand;
            this.update();
        });
    }

    ngOnInit() {
        this.preparePIXI();
        this.loadAssets();
    }

    private preparePIXI(): void {
        this._renderer = PIXI.autoDetectRenderer(1024, 768, { backgroundColor: 0x1099bb });
        document.getElementById("stage").appendChild(this._renderer.view);
        this._stage = new PIXI.Container();
    }

    private loadAssets(): void {
        this._loader = new PIXI.loaders.Loader('assets/');
        this._loader.add('frames.json');
        this._loader.load(() => this.assetsLoaded())
    }

    private assetsLoaded(): void {
        this.initServices();
    }

    private initServices(): void {
        this._gameService.initServices();
        this.gameReady();
    }

    private gameReady(): void {
        let texture = PIXI.Texture.fromFrame("back")
        let cardBack: PIXI.Sprite = new PIXI.Sprite(texture);
        cardBack.anchor.set(.5, .5);
        cardBack.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(cardBack);
        this._renderer.render(this._stage); // render initial sprites        
    }

    private update(): void {
        for (let c of this._allCards) {
            if (!c.rendered) {
                this.addCardToHand(c);
            }
        }
        this.render();
    }

    private render(): void {
        if (!this._renderer) return;
        this.renderCards();
    }

    private renderCanvas(): void {
        this._renderer.render(this._stage);
    }

    private renderCards(): void {        
        this.renderPlayerCards();
        this.renderDealerCards();
    }

    private renderPlayerCards(): void {
        if (this._playerHand.length < 1) return;
        let stageCenter: number = 512;
        let widthOfHand: number = this._playerHand.length * this._playerHand[0].width;
        let xPos = stageCenter - (widthOfHand / 2) + (this._playerHand[0].width / 2);        
        for (let c of this._playerHand) {
            TweenLite.to(c, this.MOVE_DELAY, { onUpdate: this.renderCanvas, onUpdateScope: this, x: xPos, y: this.PLAYER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    }
    
    private renderDealerCards(): void {
        if (this._dealerHand.length < 1) return;
        let stageCenter: number = 512;
        let widthOfHand: number = this._dealerHand.length * this._dealerHand[0].width;
        let xPos = stageCenter - (widthOfHand / 2) + (this._dealerHand[0].width / 2);        
        for (let c of this._dealerHand) {
            TweenLite.to(c, this.MOVE_DELAY, { onUpdate: this.renderCanvas, onUpdateScope: this, x: xPos, y: this.DEALER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    }

    private addCardToHand(cardModel: Card): void {
        let hand: CardSprite[] = cardModel.player == Player.DEALER ? this._dealerHand : this._playerHand;
        //let texture: string = cardModel.flipped ? "back" : cardModel.texture;
        let sprite: CardSprite = new CardSprite(cardModel);
        sprite.render(cardModel);
        sprite.anchor.set(.5, .5);
        sprite.position.set(this.DECK_POS.x, this.DECK_POS.y);
        hand.push(sprite);
        this._stage.addChild(sprite);
        cardModel.rendered = true;
    }

    private moveComplete(): void {
        let canHit = this._gameService.evaluateHand();
        if (!canHit) {
            alert("BUSTED");
        }
    }

    private playerChanged(player: Player): void {        
        if (player == Player.DEALER){
            this._dealerHand[0].flip();
            this.renderCanvas();
        }
    }

}