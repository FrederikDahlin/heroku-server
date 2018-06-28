function hentEn() {
    let produkt_id = getParameterByName('produkt_id');
    let url = api_adresse + 'produkter/' + produkt_id;
    let producent_id = getParameterByName('producent_id');
    let kategori_id = getParameterByName('kategori_id');
    fetch(url)
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

                //kategori
                let kategori = document.createElement('a');
                kategori.setAttribute('href', 'produkter.html?kategori_id=' + produkt.kategori_id);
                kategori.setAttribute('id', 'produkt_kategori');
                kategori.textContent = 'Se flere ' + produkt.kategori_navn + '..';

                //navn
                let navn = document.createElement('h2');
                navn.setAttribute('class', 'produkt_detalje_navn');
                navn.textContent = produkt.produkt_navn;

                //beskrivelse
                let beskrivelse = document.createElement('p');
                beskrivelse.textContent = produkt.produkt_beskrivelse;

                //pris
                let pris = document.createElement('h2');
                pris.setAttribute('class', 'produkt_pris');
                pris.textContent = formatNumbers(produkt.produkt_pris) + ",-";

                //billede
                let billede = document.createElement('img');
                billede.setAttribute('src', 'images/' + produkt.produkt_billede);
                billede.setAttribute('width', '100%;');

                let div_heading = document.getElementById('div_heading');
                let div_info = document.getElementById('div_info');
                let div_billede = document.getElementById('div_billede');

                //append
                div_heading.appendChild(producent);
                div_heading.appendChild(navn);
                div_info.appendChild(beskrivelse);
                div_info.appendChild(kategori);
                div_info.appendChild(pris);
                div_billede.appendChild(billede);
                //append'er til content

            })
        })
        .catch(error => {
            if (error) {
                console.log(error);
            }
        })

    let content_producenter = document.getElementById('content_producenter');
    fetch(api_adresse + 'producenter/')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content_producenter').textContent = 'Ingen producenter';
            }
            return response.json();
        })
        .then(json => {
            json.forEach(producent => {
                let dropdown_producenter = document.getElementById('dropdown_producenter');

                //navn
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

    let content_kategorier = document.getElementById('content_kategorier');
    fetch(api_adresse + 'kategorier/')
        .then(response => {
            if (response.status == 204) {
                document.getElementById('content_kategorier').textContent = 'Ingen kategorier';
            }
            return response.json();
        })
        .then(json => {
            json.forEach(kategori => {
                //navn
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
hentEn();

document.querySelector('.soeg_button').addEventListener('click', (event) => {
    let soeg = document.getElementById('soeg').value;

    if (soeg != '') {
        window.location.replace('produkter.html?soeg=' + soeg)
    }
})