const fs = require('fs');
const path = require('path');
const date = require('date-and-time');
const mysql = require('../config/mysql.js');
const file = path.join(__dirname, '..', 'data', 'kontakt.json');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));

// let sql = ` SELECT
//                 kontakt_navn, 
//                 kontakt_email, 
//                 kontakt_emne, 
//                 kontakt_besked
//             FROM produkter
//             INNER JOIN producenter ON producent_id = fk_producent_id 
//             INNER JOIN kategorier ON kategori_id = fk_kategori_id `;

module.exports = {
    opret_en: (navn, email, emne, besked) => {
        return new Promise((resolve, reject) => {
            // let db = mysql.connect();
            // db.execute(`INSERT INTO kontakt 
            //             SET 
            //                 kontakt_navn = ?, 
            //                 kontakt_email = ?, 
            //                 kontakt_emne = ?, 
            //                 kontakt_besked = ?,
            //                 post_dato_tid = NOW()`,
            //     [navn, email, emne, besked], (err, rows) => {
            //         if (err) {
            //             log_to_file.message(err);
            //             reject(err);
            //         }

            //         else {
            //             resolve(rows)
            //         }
            //     });
            // db.end();
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    log_to_file.message(err);
                    reject(err);
                }
                if (data == '' || data == undefined) {
                    data = [];
                }
                else {
                    data = JSON.parse(data);
                }
                data.push({
                    // "kontakt_id": id,
                    "kontakt_navn": navn,
                    "kontakt_email": email,
                    "kontakt_emne": emne,
                    "kontakt_besked": besked

                });
                fs.writeFile(file, JSON.stringify(data), (err) => {
                    if (err) {
                        log_to_file.message(err);
                        reject(err);
                    }
                    else {
                        resolve({
                            // "id": id,
                            "navn": navn,
                            "email": email,
                            "emne": emne,
                            "besked": besked
                        });
                    }
                })
            })
        });
    },

    hent_alle: () => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `ORDER BY produkt_id ASC`, [], (err, rows) => {
                if (err) {
                    log_to_file.message(err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
            db.end();
        });
    },

    hent_en: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `WHERE produkt_id = ?`,
                [id], (err, rows) => {
                    if (err) {
                        log_to_file.message(err);
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },

    opdater_en: (id, navn, beskrivelse, pris, billede) => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    log_to_file.message(err);
                    reject(err);
                }
                if (data == '' || data == undefined) {
                    data = [];
                }
                else {
                    data = JSON.parse(data);
                }
                data.forEach(produkt => {
                    // findes en frugt med samme id som den medsendte
                    if (produkt.produkt_id == id) {
                        // ændres værdierne til de nye
                        produkt.produkt_navn = navn;
                        produkt.produkt_beskrivelse = beskrivelse;
                        produkt.produkt_pris = pris;
                        produkt.produkt_billede = billede;
                    }
                })
                fs.writeFile(file, JSON.stringify(data), (err) => {
                    if (err) {
                        log_to_file.message(err);
                        reject(err);
                    }
                    else {
                        resolve({
                            "produkt_id": id,
                            "produkt_navn": navn,
                            "produkt_beskrivelse": beskrivelse,
                            "produkt_pris": pris,
                            "produkt_billede": billede
                        });
                    }
                })
            })
        });
    },

    slet_en: (id) => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    log_to_file.message(err);
                    reject(err);
                }
                if (data == '' || data == undefined) {
                    data = [];
                }
                else {
                    data = JSON.parse(data);
                }
                // her benyttes en for-løkke istedet for en forEach
                // fordi vi ønsker at ændre på arrayets struktur 
                // imens det gennemløbes...læg mærke til der tælles baglæns
                for (let i = data.length; i >= 0; i--) {
                    // er elementet null skal det fjernes
                    if (data[i] == null) {
                        // splice benyttes til at fjerne et element fra arrayet
                        data.splice(i, 1);
                    } else {
                        // matcher id på denne position det id der er sendt med
                        if (data[i].produkt_id == id) {
                            // fjernes elementet
                            data.splice(i, 1);
                        }
                    }
                }
                fs.writeFile(file, JSON.stringify(data), (err) => {
                    if (err) {
                        log_to_file.message(err);
                        reject(err);
                    }
                    else {
                        resolve('Produkt slettet');
                    }
                })
            });
        });
    }
};