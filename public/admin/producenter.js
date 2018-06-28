let content = document.getElementById('content');
function hentAlle() {
    fetch(api_adresse + 'producenter')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content').textContent = 'Ingen producenter';
            }
            return response.json();
        })
        .then(json => {
            while (content.hasChildNodes()) {
                content.removeChild(content.childNodes[0]);
            }
            json.forEach(producent => {
                //id
                let id = document.createElement('td');
                id.textContent = producent.producent_id;

                //titel
                let navn = document.createElement('td');
                navn.textContent = producent.producent_navn;

                //indhold
                let info = document.createElement('td');
                info.textContent = producent.producent_info;

                // //kategori
                // let postKategori = document.createElement('a');
                // postKategori.setAttribute('href', '../kategorier.html?kategori_id=' + producent.kategori_id);
                // postKategori.textContent = producent.kategori_titel;

                //brugernavn
                // let postBruger = document.createElement('a');
                // postBruger.setAttribute('href', '../bruger.html?bruger_id=' + post.bruger_id);
                // postBruger.textContent = post.bruger_brugernavn;

                //slet
                let slet = document.createElement('a');
                slet.setAttribute('href', '#');
                slet.setAttribute('class', 'slet');
                slet.textContent = 'Slet';
                slet.addEventListener('click', () => {
                    event.preventDefault();
                    if (confirm('Er du sikker?')) {
                        let submitDelete = {
                            method: 'DELETE',
                            headers: new Headers({
                                // 'Content-Type': 'application/json',
                                'token': sessionStorage['token']
                            })
                        }
                        fetch(api_adresse + 'producenter/' + producent.producent_id, submitDelete)
                            .then(response => {
                                let producent_id = getParameterByName('producent_id');
                                if (producent_id != undefined) {
                                    window.location.replace('producenter.html')
                                } else {
                                    hentAlle();
                                }
                            })
                            .catch(error => {
                                if (error) {
                                    console.log(error);
                                }
                            });
                    }
                })

                //ret
                let ret = document.createElement('a');
                ret.setAttribute('href', '?producent_id=' + producent.producent_id);
                ret.textContent = 'Ret';

                //tr & td
                let trow = document.createElement('tr');
                let tdata = document.createElement('td');


                trow.appendChild(id);
                trow.appendChild(navn);
                // trow.appendChild(info);
                tdata.appendChild(slet);
                tdata.appendChild(ret);
                trow.appendChild(tdata);
                // trow.appendChild(tdataBruger);
                //append'er til content
                content.appendChild(trow);
            })

        })
        .catch(error => {
            if (error) {
                console.log(error);
            }
        })
};


document.addEventListener('DOMContentLoaded', () => {
    let producent_id = getParameterByName('producent_id');
    if (producent_id != undefined) {
        fetch(api_adresse + 'producenter/' + producent_id)
            .then(response => {
                return response.json();
            })
            .then(json => {
                let form = document.getElementById('form_producenter');
                form.navn.value = json.producent_navn;
                form.info.value = json.producent_info;
            })
            .catch(error => {
                console.log(error);
            })
        let form_submit = document.getElementById('form_submit');
        form_submit.textContent = 'Gem';

        let main_h3 = document.getElementById('main_h3');
        main_h3.textContent = 'Ret producent';

        let form_anuller = document.getElementById('form_anuller');
        form_anuller.setAttribute('style', 'display: block;');
    }
    hentAlle();
});
// if (sessionStorage["token"] != undefined) {
//     let submitSettings = {
//         'headers': new Headers({
//             'token': sessionStorage['token']
//         })
//     };
// }

document.getElementById('form_submit').addEventListener('click', (event) => {
    let form = document.getElementById('form_producenter');

    let navn = form.navn.value;
    let info = form.info.value;

    let form_valid = true;

    if (navn == '') {
        form_valid = false;
        document.getElementById('fejlbesked_navn').textContent = 'Udfyld navn';
    } else {
        document.getElementById('fejlbesked_navn').textContent = '';
    }

    if (info == '') {
        form_valid = false;
        document.getElementById('fejlbesked_info').textContent = 'Udfyld info';
    } else {
        document.getElementById('fejlbesked_info').textContent = '';
    }

    if (form_valid) {
        let producent_id = getParameterByName('producent_id');
        let submitSettings = {
            'method': (producent_id != undefined ? 'PUT' : 'POST'),
            'headers': new Headers({
                'Content-Type': 'application/json',
                'token': sessionStorage['token']
            }),
            'body': JSON.stringify({
                'producent_navn': navn,
                'producent_info': info
            })
        }
        form.navn.value = '';
        form.info.value = '';

        let url = api_adresse + 'producenter';
        if (producent_id != undefined) {
            url = api_adresse + 'producenter/' + producent_id;
        }
        fetch(url, submitSettings)
            .then(response => {
                window.location.replace('producenter.html');
            })
            .catch(error => {
                console.log(error);
            })
    }

})