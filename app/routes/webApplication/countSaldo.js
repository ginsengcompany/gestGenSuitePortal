let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT tb_saldo.tipo ,tb_saldo.data,tb_saldo.importo  FROM tb_saldo WHERE tb_saldo.struttura="+user.struttura+" ORDER BY tb_saldo.data ASC";


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

        if(jsonFinale.data.length>0){

            client.end();
            return res.json({errore:false,data:jsonFinale.data});


        }
        else {

            client.end();
            return res.json({errore:true});

        }

    });


});

module.exports = router;