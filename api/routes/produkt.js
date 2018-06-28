const gm = require('gm').subClass({
    imageMagick: true
});
const fs = require('fs');
const guid = require('guid');
const path = require('path');
const jwt = require('../config/jwt.js');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));
const produkt_service = require(path.join(__dirname, '..', 'services', 'produkt.js'));

module.exports = (app) => {
    //søg
    app.get('/api/produkter/soeg/:tekst', (req, res) => {
        produkt_service.soeg(req.params.tekst)
            .then(soeg => {
                res.json(soeg);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });

    //hent alle
    app.get('/api/produkter', (req, res) => {
        produkt_service.hent_alle()
            .then(produkter => {
                res.json(produkter);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });

    //hent én
    app.get('/api/produkter/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            produkt_service.hent_en(req.params.id)
                .then(produkt => {
                    res.json(produkt);
                })
                .catch(error => {
                    res.status(500).json(error);
                })
        }
    });

    //hent alle produkter med producent id
    app.get('/api/produkter/producent/:id', (req, res) => {
        produkt_service.hent_alle_producent(req.params.id)
            .then(producent => {
                res.json(producent);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });
    //hent alle produkter med kategori id
    app.get('/api/produkter/kategori/:id', (req, res) => {
        produkt_service.hent_alle_kategori(req.params.id)
            .then(kategorier => {
                res.json(kategorier);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });

    //opret
    app.post('/api/produkter', (req, res) => {
        // denne route kræver man er logget ind, tjek at der er sendt en token via headers
        let token = jwt.open(req.headers.token);
        if (token === false) {
            // token mangler eller er ikke en valid token
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        }
        else {
            //opret et tomt array som kan opdateres ved hvert felt der mangler
            let fejl_besked = [];

            let produkt_navn = req.body.produkt_navn;
            if (produkt_navn == undefined || produkt_navn == '') {
                fejl_besked.push('navn mangler');
            }

            let produkt_beskrivelse = req.body.produkt_beskrivelse;
            if (produkt_beskrivelse == undefined || produkt_beskrivelse == '') {
                fejl_besked.push('beskrivelse mangler');
            }

            let produkt_pris = req.body.produkt_pris;
            if (produkt_pris == undefined || produkt_pris == '' || isNaN(produkt_pris)) {
                fejl_besked.push('pris mangler');
            }

            let kategori_id = req.body.fk_kategori_id;
            if (kategori_id == undefined || kategori_id == '' || isNaN(kategori_id)) {
                fejl_besked.push('kategori mangler');
            }

            let producent_id = req.body.fk_producent_id;
            if (producent_id == undefined || producent_id == '' || isNaN(producent_id)) {
                fejl_besked.push('producent mangler');
            }

            let produkt_billede = req.body.produkt_billede;
            if (produkt_billede == undefined || produkt_billede == '') {
                fejl_besked.push('billede mangler');
            }

            if (fejl_besked.length > 0) {
                // læg mærke til der sendes både et tal og et json objekt
                res.status(400).json(fejl_besked);
            } else {
                produkt_service.opret_en(produkt_navn, produkt_beskrivelse, produkt_pris, produkt_billede, kategori_id, producent_id)     
                    .then(kategori => {
                        res.json(kategori);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    })

            };
        }
    })

//     //redigere
//     app.put('/api/produkter/:id', (req, res) => {
//         if (isNaN(req.params.id)) {
//             res.sendStatus(400);
//         }
//         else {
//             //opret et tomt array som kan opdateres ved hvert felt der mangler
//             let fejl_besked = [];

//             let produkt_id = req.params.id;
//             // valideringen bør være mere omfattende end her, 
//             // dette er simplificeret udelukkende fordi fokus ligger på json og files
//             let produkt_navn = req.body.produkt_navn;
//             if (produkt_navn == undefined || produkt_navn == '') {
//                 fejl_besked.push('navn mangler');
//             }

//             let produkt_beskrivelse = req.body.produkt_beskrivelse;
//             if (produkt_beskrivelse == undefined || produkt_beskrivelse == '') {
//                 fejl_besked.push('beskrivelse mangler');
//             }

//             let produkt_pris = req.body.produkt_pris;
//             if (produkt_pris == undefined || produkt_pris == '') {
//                 fejl_besked.push('pris mangler');
//             }

//             let produkt_billede = req.body.produkt_billede;
//             if (produkt_billede == undefined || produkt_billede == '') {
//                 fejl_besked.push('billede mangler');
//             }

//             if (fejl_besked.length > 0) {
//                 // læg mærke til der sendes både et tal og et json objekt
//                 res.status(400).json(fejl_besked);
//             }
//             else {
//                 produkt_service.opdater_en(produkt_id, produkt_navn, produkt_beskrivelse, produkt_pris, produkt_billede)
//                     .then(produkt => {
//                         res.json(produkt);
//                     })
//                     .catch(error => {
//                         res.status(500).json(error);
//                     })
//             }
//         }
//     });

//     //sletter
//     app.delete('/api/produkter/:id', (req, res) => {
//         if (isNaN(req.params.id)) {
//             res.sendStatus(400);
//         }
//         else {
//             produkt_service.slet_en(req.params.id)
//                 .then(produkt => {
//                     res.json(produkt);
//                 })
//                 .catch(error => {
//                     res.status(500).json(error);
//                 })
//         }
//     });
};