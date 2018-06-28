const gm = require('gm').subClass({
    imageMagick: true
});
const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
    //hent ét
    app.get('/api/images/:name', (req, res) => {
        if (path.extname(req.params.name).toLowerCase() == '.jpg' || path.extname(req.params.name).toLowerCase() == '.png') {
            // forsøg at læs billede filen fra images mappen...
            let file = path.join(__dirname, '..', 'images', req.params.name); 

            fs.readFile(file, function (err, file) {
                if (err) {
                    // den ønskede fil blev ikke fundet, vi sender standard "no-image.png" i stedet
                    // dette kunne også have været en res.sendStatus(404)  
                    let no_image = path.join(__dirname, '..', 'images', 'no-image.png');
                    fs.readFile(no_image, (err2, default_file) => {
                        res.writeHead(200);
                        res.write(default_file);
                        res.end();
                    });
                }
                else {
                    // her kunne der skaleres "on-the-fly" ... det tager vi en anden dag
                    res.writeHead(200);
                    res.write(file);
                    res.end();
                }
            });
        } else {
            // hvis den ønskede fil ikke er en .jpg eller .png, 
            // sendes no-image som standard eller res.sendStatus(404)
            res.sendStatus(404);
        }
    });

    //hent ét (resized)
    app.get('/api/images/resized/:name', (req, res) => {
        if (path.extname(req.params.name).toLowerCase() == '.jpg' || path.extname(req.params.name).toLowerCase() == '.png') {
            // forsøg at læs billede filen fra images mappen...
            let file = path.join(__dirname, '..', 'images', 'resized', req.params.name);

            fs.readFile(file, function (err, file) {
                if (err) {
                    // den ønskede fil blev ikke fundet, vi sender standard "no-image.png" i stedet
                    // dette kunne også have været en res.sendStatus(404)  
                    let no_image = path.join(__dirname, '..', 'images', 'no-image.png');
                    fs.readFile(no_image, (err2, default_file) => {
                        res.writeHead(200);
                        res.write(default_file);
                        res.end();
                    });
                }
                else {
                    // her kunne der skaleres "on-the-fly" ... det tager vi en anden dag
                    res.writeHead(200);
                    res.write(file);
                    res.end();
                }
            });
        } else {
            // hvis den ønskede fil ikke er en .jpg eller .png, 
            // sendes no-image som standard eller res.sendStatus(404)
            res.sendStatus(404);
        }
    });

    //opret
    app.post('/api/images', (req, res) => {
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
            // grib det billede der er sendt med
            let billede = req.files.billede;
            // tjek om billedet rent faktisk ER sendt med
            if (billede == undefined) {
                res.sendStatus(400);
            }
            else {
                let upload_location = path.join(__dirname, '..', 'images', billede.name);
                billede.mv(upload_location, (err) => {
                   if (err) {
                      console.log(err);
                      res.status(500).json({ 'message': err.message });
                   } else {
                      // definer hvor det skalerede billede skal placeres
                      let resized = path.join(__dirname, '..', 'images', 'resized', billede.name);
                      // udfør skaleringen (her til en bredde på 200px)
                      gm(upload_location).resize(400,200).write(resized, (err) => {
                         if (err) {
                            // håndter fejl, hvis de opstår
                            console.log(err);
                            res.status(500).json({ 'message': err.message });
                         } else {
                            // returner besked om at billedet blev uploadet
                            res.json({
                               'message': 'billede upload success',
                               'name': billede.name
                            });
                         }
                      })
                   }
                });
            }
        }
    });

    //slet
    app.delete('/api/images/:name', (req, res) => {
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403);
        }
        else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        }
        else {
            if (path.extname(req.params.name).toLowerCase() == '.jpg' || path.extname(req.params.name).toLowerCase() == '.png') {
                // alle billeder undtagen 'no-image.png' skal kunne slettes
                if (req.params.name != 'no-image.png') {

                    // definer stien til billedet, 
                    let file = path.join(__dirname, '..', 'images', req.params.name);
                    // slet billedet fra serveren
                    fs.unlink(file, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(204);
                        }
                    });
                } else {
                    res.sendStatus(304);
                }
            } else {
                res.sendStatus(401);
            }
        }
    });

    //slet (resized)
    app.delete('/api/images/resized/:name', (req, res) => {
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403);
        }
        else if (token.bruger_rolle_niveau < 100) {
            // hvis brugeren ikke har rolle niveau 100 eller derover, sendes 401 tilbage
            res.sendStatus(401); // unauth
        }
        else {
            if (path.extname(req.params.name).toLowerCase() == '.jpg' || path.extname(req.params.name).toLowerCase() == '.png') {
                // alle billeder undtagen 'no-image.png' skal kunne slettes
                if (req.params.name != 'no-image.png') {

                    // definer stien til billedet, 
                    let file = path.join(__dirname, '..', 'images', 'resized', req.params.name);
                    
                    // slet billedet fra serveren
                    fs.unlink(file, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(204);
                        }
                    });
                } else {
                    res.sendStatus(304);
                }
            } else {
                res.sendStatus(401);
            }
        }
    });
}
