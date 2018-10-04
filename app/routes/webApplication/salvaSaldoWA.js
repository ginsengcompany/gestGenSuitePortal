let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res, next) {

    let user = req.session.user;

    let datiInsert = req.body.data;
    let data = datiInsert.data;
    let tipo = datiInsert.tipo;
    let modalita = datiInsert.modalita;
    let cliente = datiInsert.cliente;
    let importo = datiInsert.importo;
    let foto = datiInsert.foto;
    let utente = user.username;
    let struttura = user.struttura;
    let descrizione = datiInsert.descrizione;

    let client = connectionPostgres();

    let queryPostSaldo = "INSERT INTO tb_saldo" +
        "(data, tipo, modalita, cliente, importo, foto, utente, struttura, descrizione) " +
        "VALUES (" +
        "'" + data +"', " +
        "'" + tipo  +"', " +
        "'" + modalita      +"', " +
        "'" + cliente     +"', " +
        "'" + importo      +"', " +
        "'" + foto      +"', " +
        "'" + utente     +"', " +
        "'" + struttura     +"', " +
        "'" + descrizione   +"')";

    console.log(queryPostSaldo);

    const query = client.query(queryPostSaldo);

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

});

router.put('/:id', function(req, res, next) {

    let id = req.params.id;

    let client = connectionPostgres();

    let datiUpdate = req.body;

    let queryAutenticazione = "UPDATE tb_saldo SET " +
        "cliente='"+datiUpdate.clienteUp + "', " +
        "descrizione='"+datiUpdate.descrizione+"', " +
        "importo='"+datiUpdate.importo+"', " +
        "modalita='"+datiUpdate.modalita+"', " +
        "tipo='"+datiUpdate.tipoUp+"' " +
        " WHERE id='" + id + "'";

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

    let queryAutenticazione = "DELETE FROM " +
        "tb_saldo " +
        "WHERE " +
        "id='" + id + "'";

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