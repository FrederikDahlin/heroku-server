function hentAlle() {    //api
    fetch(api_adresse + 'produkter/')
        .then(response => {
            return response.json();
        })
        .then(json => {
            json.forEach(produkt => {
                //producent
                let producent = document.createElement('a');
                producent.setAttribute('href', 'produkter.html?producent_id=' + produkt.producent_id);
                producent.setAttribute('class', 'produkt_producent');
                producent.textContent = produkt.producent_navn;

                //navn
                let navn = document.createElement('a');
                navn.setAttribute('href', 'produkt.html?produkt_id=' + produkt.produkt_id);
                navn.setAttribute('class', 'produkt_navn');
                navn.textContent = produkt.produkt_navn;

                //kategori
                let kategori = document.createElement('a');
                kategori.setAttribute('href', 'produkter.html?kategori_id=' + produkt.kategori_id);
                kategori.setAttribute('class', 'produkt_kategori');
                kategori.textContent = produkt.kategori_navn;

                //beskrivelse
                let beskrivelse = document.createElement('p');
                beskrivelse.textContent = produkt.produkt_beskrivelse;

                //pris
                let pris = document.createElement('a');
                pris.setAttribute('href', 'produkt.html?produkt_id=' + produkt.produkt_id);
                pris.setAttribute('class', 'produkt_pris');
                pris.textContent = formatNumbers(produkt.produkt_pris) + ",-";

                //billede
                let a_billede = document.createElement('a');
                a_billede.setAttribute('href', 'produkt.html?produkt_id=' + produkt.produkt_id);
                let billede = document.createElement('img');
                billede.setAttribute('src', 'images/' + produkt.produkt_billede);
                billede.setAttribute('width', '100%;');
                billede.setAttribute('class', 'produkt_billede');


                let div = document.createElement('div');
                div.setAttribute('class', 'col-md-4 seneste productTeaser');


                // div.setAttribute('style', 'background-image: url(images/' + produkt.produkt_billede + ');' )
                // data.setAttribute('class', 'align_right');

                let content = document.getElementById('content');

                //append
                div.appendChild(navn);
                div.appendChild(kategori);
                div.appendChild(producent);
                div.appendChild(pris);
                div.appendChild(a_billede);
                a_billede.appendChild(billede);

                //append'er til content
                content.appendChild(div);
            })
        })
        .catch(error => {
            if (error) {
                console.log(error);
            }
        })

    fetch(api_adresse + 'producenter/')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content_producenter').textContent = 'Ingen producenter';
            }
            return response.json();
        })
        .then(json => {
            json.forEach(producent => {
                //titel
                let navn = document.createElement('a');
                navn.setAttribute('href', 'produkter.html?producent_id=' + producent.producent_id);
                navn.textContent = producent.producent_navn;

                //li
                let li = document.createElement('li');

                //append'er alt til li
                li.appendChild(navn);
                //append'er li til content
                content_producenter.appendChild(li);

            })
        })

    fetch(api_adresse + 'kategorier/')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content_kategorier').textContent = 'Ingen kategorier';
            }
            return response.json();
        })
        .then(json => {
            json.forEach(kategori => {
                //titel
                let navn = document.createElement('a');
                navn.setAttribute('href', 'produkter.html?kategori_id=' + kategori.kategori_id);
                navn.textContent = kategori.kategori_navn;

                //li
                let li = document.createElement('li');


                //append'er alt til li
                li.appendChild(navn);
                //append'er li til content
                content_kategorier.appendChild(li);
            })
        })
}
hentAlle();

document.querySelector('.send').addEventListener('click', (event) => {
    document.getElementById('fejlbesked').textContent = '';
    let form = document.getElementById('form');

    let navn = form.navn.value;
    let email = form.email.value;
    let emne = form.emne.value;
    let besked = form.besked.value;

    //hvis felter er tomme er tom
    if (navn == '' || validateEmail(email) == '' || emne == '' || besked == '') {
        //giv span#fejlbesked validering
        document.getElementById('fejlbesked').textContent = 'Udfyld alle felterne!';
    }
    else {
        form.navn.value = '';
        form.email.value = '';
        form.emne.value = '';
        form.besked.value = '';

        let submitPost = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'token': sessionStorage['token']
            }),
            body: JSON.stringify({
                'kontakt_navn': navn,
                'kontakt_email': email,
                'kontakt_emne': emne,
                'kontakt_besked': besked
            })
        }
        //
        fetch(api_adresse + 'kontakt', submitPost)
            .then(response => {
                return response.json();
            })
            .then(json => {
                hentAlle();
                //window.location.replace('../index.html');
            })
            .catch(error => {
                console.log(error);
            })
    }
})

document.querySelector('.soeg_button').addEventListener('click', (event) => {
    let soeg = document.getElementById('soeg').value;

    if (soeg != '') {
        window.location.replace('produkter.html?soeg=' + soeg)
    }
})