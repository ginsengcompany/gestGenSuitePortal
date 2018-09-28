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
    let foto = undefined;
    let utente = user.username;
    let struttura = user.struttura;
    let descrizione = datiInsert.descrizione;

    let client = connectionPostgres();

    let queryPostSaldo = "INSERT INTO tb_saldo" +
        //"(data, tipo, modalita, cliente, importo, utente, struttura, descrizione)" +
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



module.exports = router;