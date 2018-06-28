let content_producenter = document.getElementById('content_producenter');
let content_kategorier = document.getElementById('content_kategorier');
let li_produkter = document.getElementById('li_produkter');

function hentAlle() {
    let url = api_adresse + 'produkter/';
    let soeg = getParameterByName('soeg');
    let producent_id = getParameterByName('producent_id');
    let kategori_id = getParameterByName('kategori_id');

    if (soeg != undefined) {
        url = api_adresse + 'produkter/soeg/' + soeg;
    }
    if (producent_id != undefined) {
        url = api_adresse + 'produkter/producent/' + producent_id;
    }
    if (kategori_id != undefined) {
        url = api_adresse + 'produkter/kategori/' + kategori_id;
    }

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {
            json.forEach(produkter => {
                //producent
                let producent = document.createElement('a');
                producent.setAttribute('href', '?producent_id=' + produkter.producent_id);
                producent.setAttribute('class', 'produkt_producent');
                producent.textContent = produkter.producent_navn;

                //kategori
                let kategori = document.createElement('a');
                kategori.setAttribute('href', '?kategori_id=' + produkter.kategori_id);
                kategori.setAttribute('class', 'produkt_kategori');
                kategori.textContent = produkter.kategori_navn;
                let row_producent_kategori = document.createElement('div');
                row_producent_kategori.setAttribute('class', 'row div_row row_kate_prod');

                //navn
                let navn = document.createElement('a');
                navn.setAttribute('href', 'produkt.html?produkt_id=' + produkter.produkt_id);
                navn.setAttribute('class', 'produkt_navn');
                navn.textContent = produkter.produkt_navn;
                let row_navn = document.createElement('div');
                row_navn.setAttribute('class', 'row div_row');

                //beskrivelse
                let beskrivelse = document.createElement('p');
                beskrivelse.textContent = produkter.produkt_beskrivelse;
                let row_beskrivelse = document.createElement('div');
                row_beskrivelse.setAttribute('class', 'row div_row row_beskrivelse');

                //pris
                let pris = document.createElement('a');
                pris.setAttribute('href', 'produkt.html?produkt_id=' + produkter.produkt_id);
                pris.setAttribute('class', 'produkt_pris');
                pris.textContent = formatNumbers(produkter.produkt_pris) + ",-";
                let row_pris = document.createElement('div');
                row_pris.setAttribute('class', 'row div_row');

                //billede
                let a_billede = document.createElement('a');
                a_billede.setAttribute('href', 'produkt.html?produkt_id=' + produkter.produkt_id);
                let billede = document.createElement('img');
                billede.setAttribute('src', 'images/' + produkter.produkt_billede);
                billede.setAttribute('width', '100%;');
                billede.setAttribute('class', 'produkt_billede');

                //header --start
                let content_header = document.getElementById('content_header');
                // content_header.setAttribute('style', 'max-width: 1000px;');
                let header_h1 = document.getElementById('header_h1');
                header_h1.textContent = 'Produkter';
                let header_p = document.getElementById('header_p');
                header_p.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos nobis cum corrupti in animi odit placeat adipisci praesentium, numquam, ipsa, nihil iste voluptatum veniam architecto nesciunt soluta dignissimos aperiam";
                if (producent_id != undefined) {
                    header_h1.textContent = produkter.producent_navn;
                    header_p.textContent = produkter.producent_info;
                    dropdown_producenter.setAttribute('class', 'active');
                }
                if (kategori_id != undefined) {
                    header_h1.textContent = produkter.kategori_navn;
                    header_p.textContent = produkter.kategori_info;
                    dropdown_kategorier.setAttribute('class', 'active');
                }
                if (soeg != undefined) {
                    header_h1.textContent = "Søge resultat";
                    header_p.textContent = soeg
                }
                if (producent_id == undefined && kategori_id == undefined) {
                    li_produkter.setAttribute('class', 'active');
                }
                content_header.appendChild(header_h1);
                content_header.appendChild(header_p);
                //--slut

                let article = document.createElement('article');
                article.setAttribute('class', 'col-md-4 col-sm-6 produkt_article');
                // div.setAttribute('style', 'background-image: url(images/' + produkt.produkt_billede + ');' )

                let div_main = document.createElement('div');
                div_main.setAttribute('class', 'col-md-12 produkt_main');

                let div_tekst = document.createElement('div');
                div_tekst.setAttribute('class', 'produkt_tekst');

                let div_billede = document.createElement('div');
                div_billede.setAttribute('class', 'produkt_billede');

                let content = document.getElementById('content');

                //append
                div_main.appendChild(div_billede);
                div_billede.appendChild(a_billede);
                a_billede.appendChild(billede);
                div_main.appendChild(div_tekst);
                div_tekst.appendChild(row_producent_kategori);
                div_tekst.appendChild(row_navn);
                div_tekst.appendChild(row_beskrivelse);
                div_tekst.appendChild(row_pris);
                row_producent_kategori.appendChild(producent);
                row_producent_kategori.appendChild(kategori);
                row_navn.appendChild(navn);
                row_beskrivelse.appendChild(beskrivelse);
                row_pris.appendChild(pris);
                //append'er til content
                article.appendChild(div_main);
                content.appendChild(article);

                // content_header.appendChild(header);
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
                navn.setAttribute('href', '?producent_id=' + producent.producent_id);
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
                navn.setAttribute('href', '?kategori_id=' + kategori.kategori_id);
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

document.querySelector('.soeg_button').addEventListener('click', (event) => {
    let soeg = document.getElementById('soeg').value;

    if (soeg != '') {
        window.location.replace('?soeg=' + soeg)
    }
})