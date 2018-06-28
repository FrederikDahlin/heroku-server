let content = document.getElementById('content');
function hentAlle() {
    fetch(api_adresse + 'produkter')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content').textContent = 'Ingen produkter';
            }
            return response.json();
        })
        .then(json => {
            while (content.hasChildNodes()) {
                content.removeChild(content.childNodes[0]);
            }
            json.forEach(produkt => {
                //id
                let td_id = document.createElement('td');
                td_id.setAttribute('id', 'number_format_id');
                let id = document.createElement('a');
                id.setAttribute('href', '../produkt.html?produkt_id=' + produkt.produkt_id)
                id.textContent = produkt.produkt_id;
                td_id.appendChild(id);

                //navn
                let td_navn = document.createElement('td');
                let navn = document.createElement('a');
                navn.setAttribute('href', '../produkt.html?produkt_id=' + produkt.produkt_id)
                navn.textContent = produkt.produkt_navn;
                td_navn.appendChild(navn);

                //pris
                let pris = document.createElement('td');
                pris.setAttribute('id', 'number_format_pris');
                pris.textContent = formatNumbers(produkt.produkt_pris);

                //kategori
                let td_kategori = document.createElement('td');
                let kategori = document.createElement('a');
                kategori.setAttribute('href', '../produkter.html?kategori_id=' + produkt.kategori_id)
                kategori.textContent = produkt.kategori_navn;
                td_kategori.appendChild(kategori);

                //producent
                let td_producent = document.createElement('td');
                let producent = document.createElement('a');
                producent.setAttribute('href', '../produkter.html?producent_id=' + produkt.producent_id)
                producent.textContent = produkt.producent_navn;
                td_producent.appendChild(producent);

                //billede
                let billede_td = document.createElement('td');
                let billede = document.createElement('img');
                billede.setAttribute('src', api_adresse + 'images/resized/' + produkt.produkt_billede);
                billede.setAttribute('width', '50px;');
                billede_td.appendChild(billede);

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
                        fetch(api_adresse + 'produkter/' + produkt.produkt_id, submitDelete)
                            .then(response => {
                                let produkt_id = getParameterByName('produkt_id');
                                if (produkt_id != undefined) {
                                    window.location.replace('produkter.html')
                                } else {
                                    hentAlle();
                                }
                            });
                        fetch(api_adresse + 'images/' + produkt.produkt_billede, submitDelete)
                            .then(response => {
                                let produkt_id = getParameterByName('produkt_id');
                                if (produkt_id != undefined) {
                                    window.location.replace('produkter.html')
                                } else {
                                    hentAlle();
                                }
                            });
                        fetch(api_adresse + 'images/resized/' + produkt.produkt_billede, submitDelete)
                            .then(response => {
                                let produkt_id = getParameterByName('produkt_id');
                                if (produkt_id != undefined) {
                                    window.location.replace('produkter.html')
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
                ret.setAttribute('href', '?produkt_id=' + produkt.produkt_id);
                ret.textContent = 'Ret';

                //tr & td
                let trow = document.createElement('tr');
                let tdata = document.createElement('td');

                trow.appendChild(td_id);
                trow.appendChild(td_navn);
                trow.appendChild(pris);
                trow.appendChild(td_kategori);
                trow.appendChild(td_producent);
                trow.appendChild(billede_td);

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
    let produkt_id = getParameterByName('produkt_id');
    if (produkt_id != undefined) {
        fetch(api_adresse + 'produkter/' + produkt_id)
            .then(response => {
                return response.json();
            })
            .then(json => {
                let form = document.getElementById('form_produkter');
                form.navn.value = json[0].produkt_navn;
                form.beskrivelse.value = json[0].produkt_beskrivelse;
                form.pris.value = json[0].produkt_pris;
                form.kategorier.value = json[0].kategori_id;
                form.producenter.value = json[0].producent_id;
                let billede = document.getElementById('produkt_billede');
                billede.setAttribute('src', '../images/' + json[0].produkt_billede); //fordi jeg kan
            })
            .catch(error => {
                console.log(error);
            })
        let form_submit = document.getElementById('form_submit');
        form_submit.textContent = 'Gem';

        let main_h3 = document.getElementById('main_h3');
        main_h3.textContent = 'Ret produkt';

        let form_anuller = document.getElementById('form_anuller');
        form_anuller.setAttribute('style', 'display: block;');
    }
    hentAlle();
});

document.getElementById('form_submit').addEventListener('click', (event) => {
    let form = document.getElementById('form_produkter');

    // let formData = new FormData(form);

    let navn = form.navn.value;
    let beskrivelse = form.beskrivelse.value;
    let pris = form.pris.value;
    let kategorier = form.kategorier.value;
    let producenter = form.producenter.value;
    // let billede = form.billede.value

    let form_valid = true;

    if (navn == '' || beskrivelse == '' || pris == '' || kategorier == 0 || producenter == 0) {
        form_valid = false;
        document.getElementById('fejlbesked').textContent = 'Udfyld alle felter';
    } else {
        document.getElementById('fejlbesked').textContent = '';
    }

    if (form_valid) {
        let produkt_id = getParameterByName('produkt_id');
        let submitSettings = {
            'method': (produkt_id != undefined ? 'PUT' : 'POST'),
            'headers': new Headers({
                'Content-Type': 'application/json',
                'token': sessionStorage['token']
            }),
            'body': JSON.stringify({
                'produkt_navn': navn,
                'produkt_beskrivelse': beskrivelse,
                'produkt_pris': pris,
                'fk_kategori_id': kategorier,
                'fk_producent_id': producenter
            })
        }
        form.navn.value = '';
        form.beskrivelse.value = '';
        form.pris.value = '';
        form.kategorier.value = 0;
        form.producenter.value = 0;

        let url = api_adresse + 'produkter';
        if (produkt_id != undefined) {
            url = api_adresse + 'produkter/' + produkt_id;
        }
        fetch(url, submitSettings)
            .then(response => {
                window.location.replace('produkter.html');
                // hentAlle();
            })
            // .then(json => {
            //     // // tøm formular felt
            //     // form.billede.value = '';

            //     // // eksempel på hvordan man kan udskrive det uploadede billede
            //     // // dette fil kun fungere, hvis der er oprettet en route der kan returnere et billede
            //     // let img = document.createElement('img');
            //     // img.setAttribute('src', api_adresse + 'images/' + json.name);
            // })
            .catch(error => {
                console.log(error);
            })
    }
})

//select kategori
fetch(api_adresse + 'kategorier/')
    .then(response => {
        if (response.status == 204) {
            document.getElementById('content_select_kategori').textContent = 'Ingen kategorier';
        }
        return response.json();
    })
    .then(json => {
        let content_select_kategori = document.getElementById('content_select_kategori')

        let option_kategori = document.createElement('option');
        option_kategori.textContent = 'Vælg kategori';
        option_kategori.setAttribute('value', 0)
        content_select_kategori.appendChild(option_kategori);

        json.forEach(kategori => {
            //option
            let kategori_option = document.createElement('option');
            kategori_option.setAttribute('value', kategori.kategori_id);
            kategori_option.textContent = kategori.kategori_navn;

            // append'er
            content_select_kategori.appendChild(kategori_option);
        })
    })
    .catch(error => {
        if (error) {
            console.log(error);
        }
    })

//select producent
fetch(api_adresse + 'producenter/')
    .then(response => {
        if (response.status == 204) {
            document.getElementById('content_select_producent').textContent = 'Ingen producenter';
        }
        return response.json();
    })
    .then(json => {
        let content_select_producent = document.getElementById('content_select_producent')

        let option_producent = document.createElement('option');
        option_producent.textContent = 'Vælg producent';
        option_producent.setAttribute('value', 0)
        content_select_producent.appendChild(option_producent);

        json.forEach(producent => {
            //option
            let producent_option = document.createElement('option');
            producent_option.setAttribute('value', producent.producent_id);
            producent_option.textContent = producent.producent_navn;

            // append'er
            content_select_producent.appendChild(producent_option);
        })
    })
    .catch(error => {
        if (error) {
            console.log(error);
        }
    })