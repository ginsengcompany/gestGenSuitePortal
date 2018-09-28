let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT * FROM tb_auth WHERE id='"+user.id+"'";


    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(false);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        let jsonFinale = {
            "data": final
        };

        if(jsonFinale.data.length===1){

            client.end();
            return res.json({errore:false,user:jsonFinale.data[0]});


        }else if(jsonFinale.data.length===0){

            client.end();
            return res.json({errore:true});

        }

    });


});

router.put('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let datiUpdate = req.body;

    let queryAutenticazione = "UPDATE tb_auth SET username='"+datiUpdate.username+"', password='"+datiUpdate.password+"', nome='"+datiUpdate.nome+"', cognome='"+datiUpdate.cognome+"' WHERE id='"+user.id+"'";


    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(true);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        client.end();
        return res.json(false);
    });


});

router.post('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let datiInsert = req.body;

    let queryPostSaldo = " INSERT INTO tb_auth" +
        "(username, password, nome, cognome, create_date, create_user, tipo, struttura)" +
        "VALUES (" +
        "'" + datiInsert.username +"', " +
        "'" + datiInsert.password     +"', " +
        "'" + datiInsert.nome +"', " +
        "'" + datiInsert.cognome     +"', " +
        "'" + moment().format() +"', " +
        "'" + user.username +"', " +
        "FALSE, " +
        "'" + user.struttura   +"')";


    const query = client.query(queryPostSaldo);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(true);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        client.end();
        return res.json(false);
    });


});

router.put('/:id', function(req, res, next) {

    let id = req.params.id;

    let client = connectionPostgres();

    let datiUpdate = req.body;

    let queryAutenticazione = "UPDATE tb_auth SET username='"+datiUpdate.username+"', password='"+datiUpdate.password+"', nome='"+datiUpdate.nome+"', cognome='"+datiUpdate.cognome+"' WHERE id='"+id+"'";


    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(true);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        client.end();
        return res.json(false);
    });


});

router.delete('/:id', function(req, res, next) {

    let id = req.params.id;

    let client = connectionPostgres();

    let datiUpdate = req.body;

    let queryAutenticazione = "DELETE FROM tb_auth WHERE id='"+id+"' AND tipo= FALSE";


    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(true);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        client.end();
        return res.json(false);
    });


});



module.exports = router;