let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT * FROM tb_struttura";


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
        return res.json(jsonFinale);
    });


});

router.post('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let datiInsert = req.body;

    let queryPostSaldo = " INSERT INTO tb_struttura" +
        "(nome, indirizzo, recapito, email)" +
        "VALUES (" +
        "'" + datiInsert.nome +"', " +
        "'" + datiInsert.indirizzo     +"', " +
        "'" + datiInsert.recapito +"', " +
        "'" + datiInsert.email     +"')";


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

    let queryAutenticazione = "UPDATE tb_struttura SET nome='"+datiUpdate.nome+"', indirizzo='"+datiUpdate.indirizzo+"', recapito='"+datiUpdate.recapito+"', img='"+datiUpdate.text+"' WHERE id='"+id+"'";


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

    let queryAutenticazione = "DELETE FROM tb_struttura WHERE id='"+id+"'";


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