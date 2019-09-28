import Card from "./card";

export default class CardList {
    constructor(domElement) {
        this.domElement = domElement;
    }

    addCard({name, link}) {
        const {cardElement} = new Card(name, link);
        this.domElement.insertAdjacentElement('beforeend', cardElement);
    }

    render(cards) {
      cards.forEach((data) => {this.addCard(data)})
    }
        
}