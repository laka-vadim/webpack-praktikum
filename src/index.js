const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2';



import Api from "./scripts/API";

import "./pages/index.css";

export const api = new Api(serverUrl, 'd50a38f5-6271-40df-87a0-d89f0934034b');
api.loadUserProfile();
api.loadCards();
console.log('test');