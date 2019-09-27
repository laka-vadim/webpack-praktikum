export default class User {
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