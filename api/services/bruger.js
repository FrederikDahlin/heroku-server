const fs = require('fs');
const path = require('path');
const jwt = require('../config/jwt.js');
const mysql = require('../config/mysql.js');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));

let sql = ` SELECT
                bruger_id,
                bruger_navn, 
                bruger_email, 
                bruger_rolle_niveau
            FROM 
                brugere `;

module.exports = {
    login: (email, kodeord) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql + `WHERE bruger_email = ? AND bruger_kodeord = ?`,
                [email, kodeord], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]);
                        } else {
                            reject("fejl");
                        }
                    }
                });
            db.end();
        });
    },

    hent_alle: () => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql,
                [], (err, rows) => {
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
            db.execute(sql + `WHERE bruger_id = ?`,
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

    opret_en: (navn, email, rolle, kodeord) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO 
                            brugere 
                        SET 
                            bruger_navn = ?, 
                            bruger_email = ?,
                            bruger_rolle_niveau = ?,
                            bruger_kodeord = ? `,
                [navn, email, rolle, kodeord], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows)
                    }
                });
            db.end();
        });
    },

    opdater_en: (navn, email, rolle, kodeord, id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`UPDATE 
                            brugere 
                        SET 
                            bruger_navn = ?, 
                            bruger_email = ?,
                            bruger_rolle_niveau = ?,
                            bruger_kodeord = ?
                        WHERE 
                            bruger_id = ? `,
                [navn, email, rolle, kodeord, id], (err, rows) => {
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

    slet_en: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`DELETE FROM 
                            brugere
                        WHERE 
                            bruger_id = ?`,
                [id], (err, rows) => {
                    if (err) {
                        log_to_file.message(err.message);
                        reject('sql fejl' + err.message);
                    }
                    else {
                        resolve(rows)
                    }
                });
            db.end();
        });
    }
};