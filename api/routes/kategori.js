const fs = require('fs');
const path = require('path');
const jwt = require('../config/jwt.js');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));
const kategori_service = require(path.join(__dirname, '..', 'services', 'kategori.js'));

module.exports = (app) => {
    //hent alle
    app.get('/api/kategorier', (req, res) => {
        kategori_service.hent_alle()
            .then(kategori => {
                res.json(kategori);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });

    //hent én
    app.get('/api/kategorier/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            kategori_service.hent_en(req.params.id)
                .then(kategori => {
                    res.json(kategori);
                })
                .catch(error => {
                    res.status(500).json(error);
                })
        }
    });

    //opret
    app.post('/api/kategorier', (req, res) => {
        // denne route kræver man er logget ind, tjek at der er sendt en token via headers
        let token = jwt.open(req.headers.token);
        if (token === false) {
            // token mangler eller er ikke en valid token
            res.sendStatus(403); // forbidden
        }
         else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        }
        else {
            //opret et tomt array som kan opdateres ved hvert felt der mangler
            let fejl_besked = [];

            let kategori_navn = req.body.kategori_navn;
            if (kategori_navn == undefined || kategori_navn == '') {
                fejl_besked.push('navn mangler');
            }

            let kategori_info = req.body.kategori_info;
            if (kategori_info == undefined || kategori_info =='') {
                fejl_besked.push('info mangler');
            }

            if (fejl_besked.length > 0) {
                // læg mærke til der sendes både et tal og et json objekt
                res.status(400).json(fejl_besked);
            }
            else {
                kategori_service.opret_en(kategori_navn, kategori_info)
                    .then(kategori => {
                        res.json(kategori);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    })
            }
        }
    })

    //ret
    app.put('/api/kategorier/:id', (req, res) => {
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
            if (isNaN(req.params.id)) {
                res.sendStatus(400);
            }
            else {
                //opret et tomt array som kan opdateres ved hvert felt der mangler
                let fejl_besked = [];

                let kategori_navn = req.body.kategori_navn;
                if (kategori_navn == undefined || kategori_navn == '') {
                    fejl_besked.push('navn mangler');
                }

                let kategori_info = req.body.kategori_info;
                if (kategori_info == undefined) {
                    fejl_besked.push('info mangler');
                }

                if (fejl_besked.length > 0) {
                    // læg mærke til der sendes både et tal og et json objekt
                    res.status(400).json(fejl_besked);
                }
                else {
                    kategori_service.opdater_en(kategori_navn, kategori_info, req.params.id)
                        .then(kategori => {
                            res.json(kategori);
                        })
                        .catch(error => {
                            res.status(500).json(error);
                        })
                }
            }
        }
    });

    //slet
    app.delete('/api/kategorier/:id', (req, res) => {
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403);
        } else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        } 
        else {
            if (isNaN(req.params.id)) {
                res.sendStatus(400);
            }
            else {
                kategori_service.slet_en(req.params.id)
                    .then(kategori => {
                        res.json(kategori);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    })
            }
        }
    });
};