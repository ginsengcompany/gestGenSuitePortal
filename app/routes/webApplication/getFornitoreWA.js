let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let datiRegistrazione = req.body;
    let cliente = datiRegistrazione.struttura;


    let client = connectionPostgres();

    let queryStruttura = "SELECT * FROM tb_fornitori WHERE struttura='"+ user.struttura +"' order by nome_descrizione";


    const query = client.query(queryStruttura);

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

        if (jsonFinale.data.length > 0) {

            client.end();
            return res.json(jsonFinale);

        }else{
            jsonFinale = {
                "data": ''
            }
            return res.json(jsonFinale);
        }
    });
});

router.post('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let datiInsert = req.body;

    let queryPostSaldo = " INSERT INTO tb_fornitori" +
        "(nome_descrizione, piva, email, struttura)" +
        "VALUES (" +
        "'" + datiInsert.nome_descrizione +"', " +
        "'" + datiInsert.piva     +"', " +
        "'" + datiInsert.email +"', " +
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

    let queryAutenticazione = "UPDATE tb_fornitori SET " +
        "nome_descrizione='"+datiUpdate.nome_descrizione + "', " +
        "piva='"+datiUpdate.piva+"', " +
        "email='"+datiUpdate.email+
        "' WHERE id='" + id + "'";

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
        "tb_fornitori " +
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