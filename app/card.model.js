"use strict";
var Card = (function () {
    function Card() {
        this.rendered = false; // add to wrapper
        this.flipped = false; // add to wrapper
    }
    Card.prototype.reset = function () {
        this.rendered = false;
        this.player = null;
        this.flipped = false;
    };
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.model.js.map