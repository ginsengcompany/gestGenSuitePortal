let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.options('/', function(req, res, next) {

    if (req.method === 'OPTIONS') {

        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    }

    return res.json({errore:true});

});


router.post('/', function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    let datiRegistrazione = req.body;
    let cliente = datiRegistrazione.struttura;
    let categoria = datiRegistrazione.categoria;


    let client = connectionPostgres();



    let queryStruttura = "SELECT tb_fornitori.id FROM tb_prodotti INNER JOIN tb_fornitori ON tb_prodotti.fornitore = tb_fornitori.id WHERE tb_prodotti.struttura= '"+cliente+"' AND categoria='"+categoria+"' GROUP by tb_fornitori.id";


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

        if (final.length > 0) {

            client.end();
            return res.json({errore: false, id: final});


        }else{
            return res.json({errore:true});
        }
    });


});



module.exports = router;