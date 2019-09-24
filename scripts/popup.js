(function() {
    'use strict'

    class Popup {
        constructor(popupDom) {
            this.popupDom = popupDom;
        }

        open = (event) => {
            this.popupDom.classList.toggle('popup_is-opened');
            if (event.target.classList.contains('place-card__image')) {
                this.renderImage(event.target);
            } else {
                if (event.target.classList.contains('user-info__button')) {
                    this.renderForm('add');
                } else {
                    this.renderForm('edit');
                }
            }
            
        }

        renderImage(eventTarget) {

            const element = document.createElement('div');
            element.classList.add('popup__content', 'popup__image');

            const closeButton = document.createElement('img');
            closeButton.classList.add('popup__close');
            closeButton.setAttribute('src', './images/close.svg');
            element.appendChild(closeButton);

            const image = document.createElement('img');
            image.classList.add('popup__image');
            const link = eventTarget.style.backgroundImage.slice(5, -2);
            image.setAttribute('src', link);
            element.appendChild(image);
            
            this.popupDom.appendChild(element);
            this.addListenerClose();
        }

        renderForm(key) {
            const element = document.createElement('div');
            element.classList.add('popup__content');

            const closeButton = document.createElement('img');
            closeButton.classList.add('popup__close');
            closeButton.setAttribute('src', './images/close.svg');
            element.appendChild(closeButton);

            const header = document.createElement('h3');
            header.classList.add('popup__title');
            element.appendChild(header);

            const formBlock = document.createElement('form');
            formBlock.classList.add('popup__form');
            formBlock.setAttribute('novalidate', true);
            const field = document.createElement('input');
            field.classList.add('popup__input');
            field.setAttribute('required', true);
            const secondField = document.createElement('input');
            secondField.classList.add('popup__input');
            secondField.setAttribute('required', true);
            const errorMsg = document.createElement('span');
            errorMsg.classList.add('popup__error');
            const errorMsgSecond = document.createElement('span');
            errorMsgSecond.classList.add('popup__error');
            const button = document.createElement('button');
            button.classList.add('button', 'button_big', 'popup__button');

            if (key === 'add') {
                header.textContent = 'Новое место';
                formBlock.setAttribute('name', 'new');
                
                field.setAttribute('type', 'text');
                field.setAttribute('name', 'name');
                field.setAttribute('placeholder', 'Название');
                field.setAttribute('minlength', '2');
                field.setAttribute('maxlength', '30');
                formBlock.appendChild(field);
                formBlock.appendChild(errorMsg);

                secondField.setAttribute('type', 'url');
                secondField.setAttribute('name', 'link');
                secondField.setAttribute('placeholder', 'Ссылка на картинку');
                formBlock.appendChild(secondField);
                formBlock.appendChild(errorMsgSecond);

                button.textContent = '+';
                
            } else {
                header.textContent = 'Редактировать профиль';
                element.classList.add('popup_edit-profile');
                formBlock.setAttribute('name', 'edit');

                field.setAttribute('type', 'text');
                field.setAttribute('name', 'name');
                field.setAttribute('placeholder', 'Имя');
                field.setAttribute('minlength', '2');
                field.setAttribute('maxlength', '30');
                field.setAttribute('value', userName.innerText);
                formBlock.appendChild(field);
                formBlock.appendChild(errorMsg);

                secondField.setAttribute('type', 'text');
                secondField.setAttribute('name', 'description');
                secondField.setAttribute('placeholder', 'Описание');
                secondField.setAttribute('minlength', '2');
                secondField.setAttribute('maxlength', '30');
                secondField.setAttribute('value', userJob.innerText);
                formBlock.appendChild(secondField);
                formBlock.appendChild(errorMsgSecond);
                
                button.textContent = 'Сохранить';
            }

            button.setAttribute('type', 'submit');
            button.setAttribute('name', 'submit');
            formBlock.appendChild(button);

            element.appendChild(formBlock);
            popupDom.appendChild(element);

            this.addFormListener(key);
        }

        addListenerClose() {
            this.popupDom.querySelector('.popup__close')
                .addEventListener('click', this.close);
        }

        removeListenerClose() {
            this.popupDom.querySelector('.popup__close')
                .removeEventListener('click', this.close);
        }

        addFormListener(key) {
            this.addListenerClose();
            const form = document.querySelector('.popup__form');
            if (key === 'add') {
                form.elements.name
                    .addEventListener('input', this.validationText);
                form.elements.link
                    .addEventListener('input', this.validationUrl);
            } else {
                form.elements.name
                    .addEventListener('input', this.validationText);
                form.elements.description
                    .addEventListener('input', this.validationText);
            }
            form.addEventListener('submit', this.sendForm);
        }

        validationText = (event) => {
            if (event.target.validity.valueMissing) {
                this.renderError('Это обязательное поле', event.target);
            } else if (event.target.value.length < 2 || event.target.value.length > 30) {
                this.renderError('Должно быть от 2 до 30 символов', event.target);
            } else {
                this.renderError('', event.target);
            }
            this.validationButton(event.target.parentNode);

        }

        validationUrl = (event) => {
            if (event.target.validity.valueMissing) {
                this.renderError('Это обязательное поле', event.target);
            } else if (event.target.validity.typeMismatch) {
                this.renderError('Здесь должна быть ссылка', event.target);
            } else {
                this.renderError('', event.target);
            }
            this.validationButton(event.target.parentNode);
        }

        validationButton(form) {
            const firstInput = form.elements[0];
            const secondInput = form.elements[1];
            const button = form.elements[2];
            if (firstInput.checkValidity() && secondInput.checkValidity()) {
                button.classList.add('button_active');
                button.removeAttribute('disabled');
              } else {
                button.classList.remove('button_active');
                button.setAttribute('disabled', true);
              }
            
        }

        renderError(errorText, field) {
            const errorBlock = field.nextElementSibling;
            errorBlock.innerText = errorText;
        }

        removeFormListener() {
            this.removeListenerClose();
            const form = document.querySelector('.popup__form');
            if (form.getAttribute('name') === 'new') {
                form.elements.name
                    .removeEventListener('input', this.validationText);
                form.elements.link
                    .removeEventListener('input', this.validationUrl);
            } else {
                form.elements.name
                    .removeEventListener('input', this.validationText);
                form.elements.description
                    .removeEventListener('input', this.validationText);
            }
            form.removeEventListener('submit', this.sendForm);
        }

        close = () => {
            const popupInnerElem = this.popupDom.firstElementChild;
            if (popupInnerElem.classList.contains('popup__image')) {
                this.removeListenerClose();
            } else {
                this.removeFormListener();
            }
            this.popupDom.classList.toggle('popup_is-opened');
            popupInnerElem.remove();
        }

        sendForm = (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (form.getAttribute('name') === 'new') {
                cardList.addCard({
                    name: form.elements.name.value,
                    link: form.elements.link.value
                });
                popup.close();
            } else {
                api.changeUserProfile(form.elements.name.value, form.elements.description.value);
            }
        }

        buttonOnLoad() {
            this.popupDom.querySelector('.popup__button').textContent = 'Загрузка...';
        }

    }

    /* ПЕРЕМЕННЫЕ */
    
    const popupDom = document.querySelector('.popup');
    const popup = new Popup(popupDom);
    window.popup = popup;

    const addCardButton = document.querySelector('.user-info__button');
    const editProfileButton = document.querySelector('.user-info__edit-button');
    const userName = document.querySelector('.user-info__name');
    const userJob = document.querySelector('.user-info__job');


    /* СЛУШАТЕЛИ */
    addCardButton.addEventListener('click', popup.open);
    editProfileButton.addEventListener('click', popup.open);


})();