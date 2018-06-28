let content = document.getElementById('content');
function hentAlle() {
    fetch(api_adresse + 'kategorier')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content').textContent = 'Ingen kategorier';
            }
            return response.json();
        })
        .then(json => {
            while (content.hasChildNodes()) {
                content.removeChild(content.childNodes[0]);
            }
            json.forEach(kategori => {
                //id
                let id = document.createElement('td');
                id.textContent = kategori.kategori_id;

                //titel
                let navn = document.createElement('td');
                navn.textContent = kategori.kategori_navn;

                //indhold
                let info = document.createElement('td');
                info.textContent = kategori.kategori_info;

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
                        fetch(api_adresse + 'kategorier/' + kategori.kategori_id, submitDelete)
                            .then(response => {
                                let kategori_id = getParameterByName('kategori_id');
                                if (kategori_id != undefined) {
                                    window.location.replace('kategorier.html')
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
                ret.setAttribute('href', '?kategori_id=' + kategori.kategori_id);
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
    let kategori_id = getParameterByName('kategori_id');
    if (kategori_id != undefined) {
        fetch(api_adresse + 'kategorier/' + kategori_id)
            .then(response => {
                return response.json();
            })
            .then(json => {
                let form = document.getElementById('form_kategorier');
                form.navn.value = json.kategori_navn;
                form.info.value = json.kategori_info;
            })
            .catch(error => {
                console.log(error);
            })
        let form_submit = document.getElementById('form_submit');
        form_submit.textContent = 'Gem';

        let main_h3 = document.getElementById('main_h3');
        main_h3.textContent = 'Ret kategori';
        
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
    let form = document.getElementById('form_kategorier');

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
        let kategori_id = getParameterByName('kategori_id');
        let submitSettings = {
            'method': (kategori_id != undefined ? 'PUT' : 'POST'),
            'headers': new Headers({
                'Content-Type': 'application/json',
                'token': sessionStorage['token']
            }),
            'body': JSON.stringify({
                'kategori_navn': navn,
                'kategori_info': info
            })
        }
        form.navn.value = '';
        form.info.value = '';

        let url = api_adresse + 'kategorier';
        if (kategori_id != undefined) {
            url = api_adresse + 'kategorier/' + kategori_id;
        }
        fetch(url, submitSettings)
            .then(response => {
                window.location.replace('kategorier.html');
            })
            .catch(error => {
                console.log(error);
            })
    }

})