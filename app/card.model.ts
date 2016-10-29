export class Card {
    texture: string;
    values: number[];
    rendered: boolean = false; // add to wrapper
    player: number; // add to wrapper
    flipped:boolean = false; // add to wrapper

    reset():void{
        this.rendered = false;
        this.player = null;
        this.flipped = false;
    }    
}