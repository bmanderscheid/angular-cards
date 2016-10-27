import { Component, OnInit } from '@angular/core';

import { Card } from '../app/card.model'
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

    private _hand: PIXI.Sprite[];
    private _dealerHand: PIXI.Sprite[];

    private FRAME_RATE: number;
    private MOVE_DELAY: number = .3; //how long a move takes to animate

    //sprite positions
    private DECK_POS: PIXI.Point = new PIXI.Point(100, 200);
    private DEALER_Y: number = 200;
    private PLAYER_Y: number = 400;


    constructor(private _gameService: GameService) {
        this.FRAME_RATE = 1000 / 60;
        this._hand = [];
        this._dealerHand = [];
        this._gameService.currentPlayer.subscribe((newValue: Player) => { this.changePlayer(newValue) });
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
        let cardBack: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("back"));
        cardBack.anchor.set(.5, .5);
        cardBack.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(cardBack);
        this._renderer.render(this._stage); // render initial sprites        
        this.startGameLoop();
    }

    private startGameLoop(): void {
        setInterval(() => {
            this.update();
            this.render();
        }, this.FRAME_RATE)
    }

    private update(): void {
        for (let c of this._gameService.hand) {
            if (!c.rendered) {
                this.addCardToHand(c);
            }
        }
        for (let c of this._gameService.dealerHand) {
            if (!c.rendered) {
                this.addCardToHand(c);
            }
        }
    }

    private render(): void {
        this.renderHand();
        this.renderDealerHand();
        this._renderer.render(this._stage);
    }

    private renderHand(): void {
        if (this._hand.length < 1) return;
        let stageCenter: number = 512;
        let widthOfHand: number = this._hand.length * this._hand[0].width;
        let xPos = stageCenter - (widthOfHand / 2) + (this._hand[0].width / 2);
        for (let c of this._hand) {
            TweenLite.to(c, this.MOVE_DELAY, { x: xPos, y: this.PLAYER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    }

    private renderDealerHand(): void {
        if (this._dealerHand.length < 1) return;
        let stageCenter: number = 512;
        let widthOfHand: number = this._dealerHand.length * this._dealerHand[0].width;
        let xPos = stageCenter - (widthOfHand / 2) + (this._dealerHand[0].width / 2);
        for (let c of this._dealerHand) {
            TweenLite.to(c, this.MOVE_DELAY, { x: xPos, y: this.DEALER_Y, rotation: 180 * (Math.PI / 180) });
            xPos += c.width;
        }
    }

    private addCardToHand(cardModel: Card): void {
        let hand: PIXI.Sprite[] = cardModel.player == Player.PLAYER ? this._hand : this._dealerHand;        
        let texture: string = cardModel.flipped ? "back" : cardModel.texture;
        let sprite: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(texture));        
        sprite.texture = PIXI.Texture.fromFrame(texture);
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

    private changePlayer(player: Player): void {
        console.log("change player");
        if(player == Player.PLAYER)return;
        //flip dealers hand
        let cardModel: Card = this._gameService.getCardModelByIndex(Player.DEALER, 0);
        let texture: PIXI.Texture = PIXI.Texture.fromFrame(cardModel.texture);
        this._dealerHand[0].texture = texture;
        console.log(cardModel)
    }

}