import User from "./user";
import CardList from "./cardList";
import {popup} from "./popup";

const userAvaDOM = document.querySelector('.user-info__photo');
const userNameDOM = document.querySelector('.user-info__name');
const userAboutDOM = document.querySelector('.user-info__job');
const user = new User(userAvaDOM, userNameDOM, userAboutDOM);

const placesListDom = document.querySelector('.places-list');
export const cardList = new CardList(placesListDom);



export default class Api {
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
      .finally(popup.close());

      return newDate;
    }
  }