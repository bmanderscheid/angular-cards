import { Component, OnInit } from '@angular/core';

import { Card } from '../app/card.model'
import { GameService } from '../app/game.service'

@Component({
    selector: 'game',
    templateUrl: 'app/game.template.html'
})
export class GameComponent implements OnInit {

    private _stage: PIXI.Container;
    private _renderer: PIXI.SystemRenderer;
    private _loader: PIXI.loaders.Loader;

    private FRAME_RATE: number;
    private DECK_POS: PIXI.Point;

    private _cards: Card[];


    constructor(private _gameService: GameService) {
        this.FRAME_RATE = 1000 / 60;
        this.DECK_POS = new PIXI.Point(100, 100);
    }

    ngOnInit() {
        this.preparePIXI();
        this.loadAssets();
    }

    private preparePIXI(): void {
        this._renderer = PIXI.autoDetectRenderer(1024, 768, { backgroundColor: 0x1099bb });
        document.getElementById("stage").appendChild(this._renderer.view);
        this._stage = new PIXI.Container();
        this._renderer.render(this._stage);
    }

    private loadAssets(): void {
        this._loader = new PIXI.loaders.Loader('assets/');
        this._loader.add('frames.json');
        this._loader.load(() => this.assetsLoaded())
    }

    private assetsLoaded(): void {
        this.loadGameData();
    }

    private loadGameData(): void {
        this._gameService.loadCardData()
            .then(cards => {
                this._cards = cards;
                this.gameReady();
            });
    }

    private gameReady(): void {
        let cardBack: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("back"));
        cardBack.anchor.set(.5, .5);
        cardBack.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(cardBack);
        this.startGameLoop();
    }

    private startGameLoop(): void {
        setInterval(() => {
            this._renderer.render(this._stage);
        }, this.FRAME_RATE)
    }

    // GAME CONTROL

    private drawCard(): void {
        let card: Card = this._cards[Math.floor(Math.random() * 52)];
        let frame: PIXI.Texture = PIXI.Texture.fromFrame(card.texture);
        let sprite: PIXI.Sprite = new PIXI.Sprite(frame);
        sprite.anchor.set(.5, .5);
        sprite.position.set(this.DECK_POS.x, this.DECK_POS.y);
        this._stage.addChild(sprite);
        TweenLite.to(sprite, 1, { x: 512, y: 384, rotation: 180 * (Math.PI / 180) });
    }

}