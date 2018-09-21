let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let nodemailer = require('nodemailer');


let connectionPostgres = function () {
    return postgresConnection();
};

router.options('/', function(req, res, next) {

    if (req.method === 'OPTIONS') {

        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    }

    return res.json({errore:true});

});


router.post('/', function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    let datiInsert = req.body;
    let struttura = datiInsert.struttura;
    let fornitore = datiInsert.fornitore;
    let codice = datiInsert.codice;
    let descrizione_prodotto = datiInsert.descrizione_prodotto;
    let quantita = datiInsert.quantita;
    let user_admin = datiInsert.user_admin;
    let emailFornitore = datiInsert.emailFornitore;
    let emailStruttura = datiInsert.emailStruttura;

    let client = connectionPostgres();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gestgensuite.emailservices@gmail.com',
            pass: 'usergesan'
        }
    });

    let mailOptions = {
        from: 'gestgensuite.emailservices@gmail.com',
        to: emailFornitore,
        cc:emailStruttura,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };



    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {

            let queryPostRichiesta = "INSERT INTO tb_richieste" +
                "(struttura, fornitore, codice, descrizione_prodotto, data, quantita, user_admin)" +
                "VALUES (" +
                "'" + struttura +"', " +
                "'" + fornitore  +"', " +
                "'" + codice      +"', " +
                "'" + descrizione_prodotto     +"', " +
                "'" + moment().format()    +"', " +
                "'" + quantita      +"', " +
                "'" + user_admin   +"')";

            const query = client.query(queryPostRichiesta);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json(false);
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                client.end();
                return res.json(true);
            });

        }
    });


});



module.exports = router;