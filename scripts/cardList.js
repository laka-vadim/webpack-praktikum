// Отлично: Разбил код на несколько файлов
(function() {
    'use strict'

    class CardList {
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

    class Card {
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

    class User {
      constructor(avaDOM, nameDOM, aboutDOM) {
        this.avaDOM = avaDOM;
        this.nameDOM = nameDOM;
        this.aboutDOM = aboutDOM;
      }

      render(data) {
        this.avaDOM.style.backgroundImage = `url(${data.avatar})`;
        this.nameDOM.textContent = data.name;
        this.aboutDOM.textContent = data.about;
      }
    }


/*
  Можно лучше: из всех методом класса Api лучше вынести все, что не касается работы с сервером.
  Методы класса при этом возвращают промисы с данными:
      
  Например, метод loadCards - только запрос и возврат ответа сервера
  loadCards() {
    return fetch(`${this.SERVER_IP}/cards`, { // <-- возвращаем промис
      headers: {
        authorization: this.SERVER_TOKEN
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res.status);
      }
    })
  }    

  Использование метода loadCards - получение ответа сервера, рендеринг карточек и обработка ошибок
  api.loadCards()
    .then((res) => {
       cardList.render(res);
    })
    .catch((err) => {console.log(err)});
*/
    class Api {
      constructor(SERVER_IP, SERVER_TOKEN) {
        this.SERVER_IP = SERVER_IP;
        this.SERVER_TOKEN = SERVER_TOKEN;
      }

      loadUserProfile() {
        fetch(`${this.SERVER_IP}/users/me`, {
          headers: {
            authorization: this.SERVER_TOKEN
          }
        })
          .then((res) => {

            /*
              Можно лучше: Проверка ответа сервера и конвертация из json 
              дублируется в каждом методе, можно вынести в отдельный метод и 
              использовать его:

              getResponse(res) {
                if (res.ok) {
                  return res.json();
                } else {
                  return Promise.reject(res.status);
                }
              }
            
            */
            if (res.ok) {
              return res.json();
            } else {
              return Promise.reject(res.status);
            }
          })
          .then((res) => {
            user.render(res);
          })
          .catch((err) => {console.log(err)});
      }

      loadCards() {
        fetch(`${this.SERVER_IP}/cards`, {
          headers: {
            authorization: this.SERVER_TOKEN
          }
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              return Promise.reject(res.status);
            }
          })
          .then((res) => {
            cardList.render(res);
          })
          .catch((err) => {console.log(err)});
      }

      changeUserProfile(name, about) {
        let newDate;
        popup.buttonOnLoad();
        fetch(`${this.SERVER_IP}/users/me`, {
          method: 'PATCH',
          headers: {
            authorization: this.SERVER_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            about: about
          })
        })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        })
        .then((res) => {
          user.render(res);
        })
        .catch((err) => {console.log(err)})
        .finally(popup.close()); /* Можно лучше: закрывать попап лучше только когда 
        запрос выполнился успешно. Блок finally выполняется всегда, независимо от того
        была ошибка при обращении к серверу или нет  */

        return newDate;
      }
    }

    /* ПЕРЕМЕННЫЕ */
    const userAvaDOM = document.querySelector('.user-info__photo');
    const userNameDOM = document.querySelector('.user-info__name');
    const userAboutDOM = document.querySelector('.user-info__job');
    const placesListDom = document.querySelector('.places-list');
    
    const api = new Api('http://95.216.175.5/cohort2', 'd50a38f5-6271-40df-87a0-d89f0934034b');
    const cardList = new CardList(placesListDom);
    const user = new User(userAvaDOM, userNameDOM, userAboutDOM);
    window.cardList = cardList;
    window.api = api;

    api.loadUserProfile();
    api.loadCards();
})();
