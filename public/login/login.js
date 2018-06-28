function hentAlle() {
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
                navn.setAttribute('href', '../produkter.html?producent_id=' + producent.producent_id);
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
                navn.setAttribute('href', '../produkter.html?kategori_id=' + kategori.kategori_id);
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

document.getElementById('login').addEventListener('click', (event) => {
    document.getElementById('fejlbesked_login').textContent = '';

    let email = document.getElementById('email').value;
    let kodeord = document.getElementById('kodeord').value;

    if (email == '' || kodeord == '') {
        document.getElementById('fejlbesked_login').textContent = 'udfyld begge felter';
    }
    else {
        let submitPost = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'bruger_email': email,
                'bruger_kodeord': kodeord
            })
        };

        fetch(api_adresse + 'login', submitPost)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    return response.json();
                }
                else {
                    throw new Error('forkert email / kodeord');
                }
            })
            .then(json => {
                sessionStorage['token'] = json.token;
                window.location.replace('../admin/produkter.html');
            })
            .catch(fejlbeksed => {
                document.getElementById('fejlbesked_login').textContent = fejlbeksed.message;
            })
    }
});