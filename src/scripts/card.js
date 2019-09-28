import {popup} from "./popup";

export default class Card {
    constructor(name, link) {
        this.cardElement = this.create(name, link);
    }

    create(name, link) {
        const cardBlock = document.createElement('div');
        cardBlock.classList.add('place-card');
        const image = document.createElement('div');
        image.classList.add('place-card__image');
        const delButton = document.createElement('button');
        delButton.classList.add('place-card__delete-icon');
        const description = document.createElement('div');
        description.classList.add('place-card__description');
        const cardName = document.createElement('h3');
        cardName.classList.add('place-card__name');
        const likeButton = document.createElement('button');
        likeButton.classList.add('place-card__like-icon');

        image.appendChild(delButton);
        description.appendChild(cardName);
        description.appendChild(likeButton);
        cardBlock.appendChild(image);
        cardBlock.appendChild(description);

        cardName.innerText = name;
        image.setAttribute('style', `background-image: url(${link})`);

        return this.addListeners(cardBlock);
    }

    addListeners(cardElement) { 
        cardElement.querySelector('.place-card__like-icon')
            .addEventListener('click', this.like);
        cardElement.querySelector('.place-card__delete-icon')
            .addEventListener('click', this.remove);
        cardElement.querySelector('.place-card__image')
            .addEventListener('click', popup.open);
        return cardElement;
    }

    like = (event) => {
        event.target.classList.toggle('place-card__like-icon_liked');
    }

    remove = (event) => {
        const card = event.target.closest('.place-card');
        this.delListeners(card);
        card.parentNode.removeChild(card);
    }

    delListeners (cardElement) {
        cardElement.querySelector('.place-card__like-icon')
            .removeEventListener('click', this.like);
        cardElement.querySelector('.place-card__delete-icon')
            .removeEventListener('click', this.remove);
        cardElement.querySelector('.place-card__image')
            .removeEventListener('click', popup.open);
    }
}