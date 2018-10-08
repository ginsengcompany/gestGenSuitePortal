let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};


router.get('/:id', function (req, res, next) {

    let user = req.session.user;

    let id = req.params.id;

    let myObj = JSON.stringify(id);
    let final = JSON.parse(JSON.parse(myObj));

    let tipo = final.tipo;
    let struttura = user.struttura;


    let queryProdotti = '';


    let client = connectionPostgres();

    if (tipo === 'multipla') {
        queryProdotti = "SELECT tb_prodotti.id as id_prodotto, * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' order by tb_fornitori.id";
    }
    else if (tipo === 'categoria') {

        let categoria = final.categoria;

        queryProdotti = "SELECT tb_prodotti.id as id_prodotto, * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND categoria='"+categoria+"' order by tb_fornitori.id";
    }
    else if (tipo === 'fornitore'){

        let fornitore = final.fornitore;

        queryProdotti = "SELECT tb_prodotti.id as id_prodotto, * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND fornitore='"+fornitore+"' order by tb_fornitori.id";

    }
    else if (tipo === 'double'){

        let fornitore = final.fornitore;
        let categoria = final.categoria;

        queryProdotti = "SELECT tb_prodotti.id as id_prodotto, * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND fornitore='"+fornitore+"' AND categoria='"+categoria+"' order by tb_fornitori.id";

    }

    const query = client.query(queryProdotti);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function () {
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

router.post('/:id', function(req, res, next) {

    let user = req.session.user;

    let datiInsert = req.body;
    let codice = datiInsert.codice;
    let descrizione = datiInsert.descrizione;
    let categoria = datiInsert.categoria;
    let fornitore = datiInsert.fornitore;
    let struttura = user.struttura;

    let client = connectionPostgres();


    let queryPostSaldo = "INSERT INTO tb_prodotti" +
        "(codice, fornitore, struttura, categoria, descrizione)" +
        "VALUES (" +
        "'" + codice +"', " +
        "'" + fornitore     +"', " +
        "'" + struttura   +"', "+
        "'" + categoria   +"', "+
        "'" + descrizione   +"')";


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

    let queryAutenticazione = "UPDATE tb_prodotti SET " +
        "codice='"+datiUpdate.codice + "', " +
        "descrizione='"+datiUpdate.descrizione+"', " +
        "categoria='"+datiUpdate.categoria+"', " +
        "fornitore='"+datiUpdate.fornitore+"' " +
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
        "tb_prodotti " +
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