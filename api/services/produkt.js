const gm = require('gm').subClass({
    imageMagick: true
});
const guid = require('guid');

const fs = require('fs');
const path = require('path');
const mysql = require('../config/mysql.js');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));

let sql = ` SELECT
                produkt_id,
                produkt_navn, 
                produkt_beskrivelse, 
                produkt_pris, 
                produkt_billede,
                kategori_id,
                kategori_info,
                kategori_navn,
                producent_id,
                producent_info,
                producent_navn
            FROM produkter
            INNER JOIN kategorier ON kategori_id = fk_kategori_id
            INNER JOIN producenter ON producent_id = fk_producent_id `;

module.exports = {
    soeg: (tekst) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            tekst = "%" + tekst + "%";
            db.execute(sql + `  WHERE produkt_navn
                                LIKE ?
                                OR produkt_beskrivelse
                                LIKE ?
                                OR  producent_navn
                                LIKE ?
                                OR kategori_navn
                                LIKE ?`,
                [tekst, tekst, tekst, tekst], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },

    hent_alle: () => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `ORDER BY produkt_id DESC`, [], (err, rows) => {
                if (err) {
                    log_to_file.message(err.message);
                    reject('sql fejl' + err.message);
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
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },

    hent_alle_producent: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `  WHERE fk_producent_id = ?
                                ORDER BY produkt_id 
                                ASC`,
                [id], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },
    hent_alle_kategori: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `  WHERE fk_kategori_id = ?
                                ORDER BY produkt_id 
                                DESC`,
                [id], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },


    opret_en: (navn, beskrivelse, pris, billede, kategori, producent) => { 
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO 
                            produkter 
                        SET 
                            produkt_navn = ?, 
                            produkt_beskrivelse = ?, 
                            produkt_pris = ?, 
                            produkt_billede = ?, 
                            fk_kategori_id = ?,
                            fk_producent_id = ? `,       
                [navn, beskrivelse, pris, billede, kategori, producent], (err, rows) => { 
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows)
                        }
                    }
                });
            db.end();

        });
    },



    opdater_en: (navn, beskrivelse, pris, billede, kategori_id, producent_id) => {
        return new Promise((resolve, reject) => {
            let sql_query = `UPDATE brugere 
                                SET 
                                produkt_navn = ?, 
                                produkt_beskrivelse = ?, 
                                produkt_pris = ?, 
                                produkt_billede = ?,
                                fk_kategori_id = ?,
                                fk_producent_id = ?`;
            // her samler vi de to værdier som vi ved skal ændres
            let sql_params = [produkt_navn, produkt_beskrivelse, produkt_pris, produkt_billede, kategori, producent];

            // hvis der er data i kodeord, betyder det at kodeordet også skal rettes, og SQL skal ændres
            console.log(bruger_kodeord);
            if (bruger_kodeord != '') {
                // her tilføjer vi brugerkodeord til sql sætningen.
                // og ja, det er vigtigt at have kommaet!
                sql_query += ` , bruger_kodeord = ? `;
                // nu er der også et kodeord der skal sendes med som parameter
                sql_params.push(bruger_kodeord);
            }

            // hvis der er sendt et billede til denne PUT route, så skal vi håndtere uploaden 
            if (produkt_billede != undefined) {
                let billede_navn = guid.create() + path.extname(produkt_billede.name);
                // her tilføjer vi det nye billede til sql sætningen, igen er det vigtigt at have kommaet!
                sql_query += ` , produkt_billede = ? `
                // navnet på det nye billede tilføjes sqlparametre samlingen
                sql_params.push(billede_navn);

                // her håndtes upload og skalering. Vi er desværre nødt til at sætte processen igang, 
                // men vi kan ikke vente på at den afsluttes, fordi det er ikke garanteret der er et billde med
                // vi mangler stadig at afslutte SQL sætningen og udføre den... 
                // så for at undgå dubletter af db.execute, så køres upload og skalering i baggrunden
                //  og SQL afsluttes uden at vente på billedet.. 
                // der er ingen res.status eller res.json i billede håndteringen
                let upload_location = path.join(__dirname, '..', 'images', billede_navn);
                // benyt den express-fileuplod funktionen mv() til at flytte billedet
                produkt_billede.mv(upload_location, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // definer hvor det skalerede billede skal placeres
                        let resized = path.join(__dirname, '..', 'images', 'resized', billede_navn);
                        // udfør skaleringen (her til en bredde på 200px)
                        gm(upload_location).resize(300, 300).write(resized, (err) => {
                            if (err) {
                                // håndter fejl, hvis de opstår
                                console.log(err);
                            }
                        })
                    }
                });
            }

            // // når vi færdige med at se efter kodeord eller billede, og nu kan vi afslutte SQL med at tilføje bruger id 
            // sql_query += ` WHERE bruger_id = ? `;
            // sql_params.push(token.bruger_id);

            console.log(sql_query);


            let db = mysql.connect();
            db.execute(sql_query, sql_params, (err, rows) => {
                if (err) {
                    console.log(err.message); // log fejlbeskeden på serveren
                    res.status(500).json({ "message": err.message }); // send fejlbeskeden til klientsiden
                } else {
                    // hvis affectedRows er mere end 0, betyder det at mindst 1 række blev ændret, 
                    // og derfor blev rediger funktionen en success, og status 204 (OK, NO CONTENT) returneres
                    if (rows.affectedRows > 0) {
                        res.sendStatus(204);
                    } else {
                        // ingen rettelser, dvs vi sender status 304 (NOT MODIFIED) tilbage
                        res.sendStatus(304);
                    }
                }
            });
            db.end();
        });
    },

    slet_en: (id) => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    log_to_file.message(err.message);
                    reject('sql fejl' + err.message);
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