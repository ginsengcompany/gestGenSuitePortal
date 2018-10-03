let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};


router.get('/', function(req, res, next) {

    let user = req.session.user;


    let client = connectionPostgres();

    let queryStruttura = "SELECT * FROM tb_categoria WHERE struttura='"+user.struttura+"' order by text";


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

    let datiInsert = req.body;
    let value = datiInsert.value.toLowerCase();
    let text = datiInsert.value.toUpperCase();
    let struttura = user.struttura;

    let client = connectionPostgres();


    let queryPostSaldo = "INSERT INTO tb_categoria" +
        "(value, text, struttura)" +
        "VALUES (" +
        "'" + value +"', " +
        "'" + text     +"', " +
        "'" + struttura   +"')";


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