const api_adresse = 'http://localhost:3000/api/';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function emptyElement(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.childNodes[0]);
    }
}

function validateEmail(emailTjek) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailTjek);
}

const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDato(date) {
    let dato = new Date(date);
    return dato.getDate() + "-" +
        ("0" + (dato.getMonth() + 1)).slice(-2) + "-" +
        ("0" + dato.getFullYear()).slice(-4) + " " +
        ("0" + dato.getHours()).slice(-2) + ":" +
        ("0" + dato.getMinutes()).slice(-2)
}

// function setSelectDefault(element, text, value) {
//     let option = document.createElement('option');
//     option.setAttribute('value', value);
//     option.textContent = 'vælg kategori';
//     element.appendChild(option);
//  }