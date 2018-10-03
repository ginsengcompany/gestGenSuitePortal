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

    let queryAutenticazione = "SELECT *, tb_struttura.nome AS nome_struttura, tb_auth.nome AS nome_auth, tb_auth.id AS id_auth FROM tb_auth INNER JOIN tb_struttura ON tb_auth.struttura = tb_struttura.id  WHERE tb_auth.tipo = TRUE";


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
        "'SuperAdministrator', " +
        "TRUE, '"+datiInsert.struttura+"')";


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

    let queryAutenticazione = "DELETE FROM tb_auth WHERE id='"+id+"' AND tipo= TRUE";


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