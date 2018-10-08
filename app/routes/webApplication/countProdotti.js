let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT tb_categoria.text ,COUNT(*) FROM tb_prodotti INNER JOIN tb_categoria ON  tb_prodotti.categoria = tb_categoria.id WHERE tb_prodotti.struttura="+user.struttura+" GROUP BY tb_categoria.text ORDER BY tb_categoria.text";


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