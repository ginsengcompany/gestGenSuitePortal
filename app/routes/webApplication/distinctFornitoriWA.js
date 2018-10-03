let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res, next) {

    let user = req.session.user;

    let datiRegistrazione = req.body;
    let cliente = user.struttura;


    let client = connectionPostgres();

    let queryStruttura = "SELECT DISTINCT fornitore FROM tb_prodotti WHERE struttura='"+cliente+"'";


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
            return res.json({errore: false, id: jsonFinale.data});


        }else{
            return res.json({errore:true});
        }
    });


});



module.exports = router;