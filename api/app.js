const express = require('express');
const app = express();

const logger = require('morgan');
app.use(logger('dev'));

//sæt express op til at benytte body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// dette modul kan benyttes til at håndtere filuploads
const fileupload = require('express-fileupload');
// det er muligt at bestemme hvor store filer der må uploades
app.use(fileupload({
   limits: {
      fileSize: 10 * 1024 * 1024
   } // 10mb
}));

//hent API routes
require('./routes/producent.js')(app);
require('./routes/kategori.js')(app);
require('./routes/produkt.js')(app);
require('./routes/kontakt.js')(app);
require('./routes/bruger.js')(app);
require('./routes/image.js')(app);

//bestem hvilken mappe der skal servere statiske filer
app.use(express.static('public'));

//vælg en port til API serveren
app.listen(3000, (err) => {
    if (err) {
       console.log(err);
    }
    console.log('App is listening on http://localhost:3000');
 });