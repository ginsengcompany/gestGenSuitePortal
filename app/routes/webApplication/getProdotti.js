let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};


router.post('/', function (req, res, next) {

    let user = req.session.user;

    let datiSaldo = req.body;
    let tipo = datiSaldo.tipo;
    let struttura = user.struttura;


    let queryProdotti = '';


    let client = connectionPostgres();

    if (tipo === 'multipla') {
        queryProdotti = "SELECT * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' order by tb_fornitori.id";
    }
    else if (tipo === 'categoria') {

        let categoria = datiSaldo.categoria;

        queryProdotti = "SELECT * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND categoria='"+categoria+"' order by tb_fornitori.id";
    }
    else if (tipo === 'fornitore'){

        let fornitore = datiSaldo.fornitore;

        queryProdotti = "SELECT * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND fornitore='"+fornitore+"' order by tb_fornitori.id";

    }
    else if (tipo === 'double'){

        let fornitore = datiSaldo.fornitore;
        let categoria = datiSaldo.categoria;

        queryProdotti = "SELECT * FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura='" + struttura + "' AND fornitore='"+fornitore+"' AND categoria='"+categoria+"' order by tb_fornitori.id";

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

        if (jsonFinale.data.length > 0) {

            client.end();
            return res.json({errore: false, id: jsonFinale.data});


        }else{
            return res.json({errore:true});
        }
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


module.exports = router;