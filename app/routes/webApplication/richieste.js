let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/:id', function(req, res, next) {

    let id = req.params.id;

    let user = req.session.user;

    let client = connectionPostgres();

    let queryClienti = "SELECT F.nome_descrizione, F.email, R.codice, R.descrizione_prodotto, R.quantita, R.data, A.username, A.nome, A.cognome from tb_richieste R JOIN tb_fornitori F ON R.fornitore = f.id  JOIN tb_auth A ON R.user_admin = A.id WHERE R.struttura = " + user.struttura + " AND R.fornitore="+ id;


    const query = client.query(queryClienti);

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

module.exports = router;