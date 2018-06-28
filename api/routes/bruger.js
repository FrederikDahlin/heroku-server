const path = require('path');
const jwt = require('../config/jwt.js');
const mysql = require('../config/mysql.js');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));
const bruger_service = require(path.join(__dirname, '..', 'services', 'bruger.js'));

module.exports = (app) => {
    //login
    app.post('/api/login', (req, res) => {
        let fejl_besked = [];

        let bruger_email = req.body.bruger_email;
        if (bruger_email == undefined) {
            fejl_besked.push('email mangler');
        }

        let bruger_kodeord = req.body.bruger_kodeord;
        if (bruger_kodeord == undefined) {
            fejl_besked.push('kodeord mangler');
        }

        if (bruger_email == '' || bruger_kodeord == '') {
            res.sendStatus(400);
        }
        else {
            bruger_service.login(bruger_email, bruger_kodeord)
                .then(bruger => {
                    let token = jwt.create({
                        "bruger_id": bruger.bruger_id,
                        "bruger_rolle_niveau": bruger.bruger_rolle_niveau
                    });
                    res.json({
                        "token": token
                    });
                })
                .catch(error => {
                    res.status(500).json(error);
                })
        }
    });

    //hent alle
    app.get('/api/brugere', (req, res) => {
        bruger_service.hent_alle()
            .then(brugere => {
                res.json(brugere);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    });

    //hent én
    app.get('/api/brugere/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            bruger_service.hent_en(req.params.id)
                .then(bruger => {
                    res.json(bruger);
                })
                .catch(error => {
                    res.status(500).json(error);
                })
        }
    });

    //opret
    app.post('/api/brugere', (req, res) => {
        // denne route kræver man er logget ind, tjek at der er sendt en token via headers
        let token = jwt.open(req.headers.token);
        if (token === false) {
            // token mangler eller er ikke en valid token
            res.sendStatus(403); // forbidden
        }
        else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        } else {
            //opret et tomt array som kan opdateres ved hvert felt der mangler
            let fejl_besked = [];

            let bruger_navn = req.body.bruger_navn;
            if (bruger_navn == undefined || bruger_navn == '') {
                fejl_besked.push('navn mangler');
            }

            let bruger_email = req.body.bruger_email;
            if (bruger_email == undefined || bruger_email == '') {
                fejl_besked.push('email mangler');
            }

            let bruger_rolle_niveau = req.body.bruger_rolle_niveau;
            if (bruger_rolle_niveau == undefined || bruger_rolle_niveau == '') {
                fejl_besked.push('rolle mangler');
            }

            let bruger_kodeord = req.body.bruger_kodeord;
            if (bruger_kodeord == undefined || bruger_kodeord == '') {
                fejl_besked.push('kodeord mangler');
            }

            if (fejl_besked.length > 0) {
                // læg mærke til der sendes både et tal og et json objekt
                res.status(400).json(fejl_besked);
            }
            else {
                bruger_service.opret_en(bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord)
                    .then(bruger => {
                        res.json(bruger);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    })
            }
        }
    })

    //redigere
    app.put('/api/brugere/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        } else {
            // denne route kræver man er logget ind, tjek at der er sendt en token via headers
            let token = jwt.open(req.headers.token);
            if (token === false) {
                // token mangler eller er ikke en valid token
                res.sendStatus(403); // forbidden
            } else if (token.bruger_rolle_niveau < 100) {
                // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
                res.sendStatus(401); // unauth
            } else {
                //opret et tomt array som kan opdateres ved hvert felt der mangler
                let fejl_besked = [];

                let bruger_navn = req.body.bruger_navn;
                if (bruger_navn == undefined || bruger_navn == '') {
                    fejl_besked.push('navn mangler');
                }

                let bruger_email = req.body.bruger_email;
                if (bruger_email == undefined || bruger_email == '') {
                    fejl_besked.push('email mangler');
                }

                let bruger_rolle_niveau = req.body.bruger_rolle_niveau;
                if (bruger_rolle_niveau == undefined || bruger_rolle_niveau == '') {
                    fejl_besked.push('rolle mangler');
                }

                let bruger_kodeord = req.body.bruger_kodeord;
                if (bruger_kodeord == undefined || bruger_kodeord == '') {
                    fejl_besked.push('kodeord mangler');
                }

                if (fejl_besked.length > 0) {
                    // læg mærke til der sendes både et tal og et json objekt
                    res.status(400).json(fejl_besked);
                } else {
                    bruger_service.opdater_en(bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord, req.params.id)
                        .then(bruger => {
                            res.json(bruger);
                        })
                        .catch(error => {
                            res.status(500).json(error);
                        })
                }
            }
        }
    });

    //sletter
    app.delete('/api/brugere/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        }
        else {
            bruger_service.slet_en(req.params.id)
                .then(bruger => {
                    res.json(bruger);
                })
                .catch(error => {
                    res.json(error);
                })
        }
    });
};