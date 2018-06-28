const fs = require('fs');
const path = require('path');
const date = require('date-and-time');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));
const kontakt_service = require(path.join(__dirname, '..', 'services', 'kontakt.js'));

module.exports = (app) => {
    //opretter
    app.post('/api/kontakt', (req, res) => {
        let kontakt_navn = req.body.kontakt_navn;
        if (kontakt_navn == undefined || kontakt_navn == '') {
            kontakt_navn = '';
        }

        let kontakt_email = req.body.kontakt_email;
        if (kontakt_email == undefined || kontakt_email == '') {
            kontakt_email = '';
        }
        
        let kontakt_emne = req.body.kontakt_emne;
        if (kontakt_emne == undefined || kontakt_emne == '') {
            kontakt_emne = '';
        }

        let kontakt_besked = req.body.kontakt_besked;
        if (kontakt_besked == undefined || kontakt_besked == '') {
            kontakt_besked = '';
        }
        
    if (kontakt_navn == '' || validateEmail(kontakt_email) == '' || kontakt_emne == '' || kontakt_besked == '') {
            res.sendStatus(400); 
        }
        else {
            kontakt_service.opret_en(kontakt_navn, kontakt_email, kontakt_emne, kontakt_besked)
                .then(kontakt => {
                    res.json(kontakt);
                })
                .catch(error => {
                    res.status(500).json(error);
                })
        }
    })

    //redigere
    app.put('/api/producent/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            //opret et tomt array som kan opdateres ved hvert felt der mangler
            let fejl_besked = [];

            let producent_id = req.params.id;
            // valideringen bør være mere omfattende end her, 
            // dette er simplificeret udelukkende fordi fokus ligger på json og files
            let producent_navn = req.body.producent_navn;
            if (producent_navn == undefined) {
                fejl_besked.push('navn mangler');
            }

            if (fejl_besked.length > 0) {
                // læg mærke til der sendes både et tal og et json objekt
                res.status(400).json(fejl_besked);
            }
            else {
                producent_service.opdater_en(producent_id, producent_navn)
                    .then(producent => {
                        res.json(producent);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    })
            }
        }
    });

    //sletter
    app.delete('/api/producent/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            producent_service.slet_en(req.params.id)
            .then(producent => {
                res.json(producent);
            })
            .catch(error => {
                res.status(500).json(error);
            })
        }
    });
};