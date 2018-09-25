let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function (req, res, next) {
    let user = req.session.user;

    let datiSaldo = req.body.data;
    let tipo = datiSaldo.tipo;
    let struttura = user.struttura;

    let querySaldo = '';

    let client = connectionPostgres();

    if (tipo === 'giorno') {
        querySaldo = "SELECT * FROM tb_saldo WHERE data='" + datiSaldo.dataFrom + "' AND struttura='" + struttura + "'";
    }
    else if (tipo === 'range') {

        querySaldo = "SELECT * FROM  tb_saldo WHERE tb_saldo.data BETWEEN '" + datiSaldo.dataFrom + "' AND '"+ datiSaldo.dataTo +"' AND  tb_saldo.struttura='" + struttura + "'";
    }
    else if (tipo === 'giornocli'){
        let cliente = datiSaldo.cliente;

        querySaldo = "SELECT * FROM tb_saldo WHERE data='" + datiSaldo.dataFrom + "' AND struttura='" + struttura + "' AND cliente='"+cliente+"'";

    }
    else if (tipo === 'rangecli'){

        let cliente = datiSaldo.cliente;

        querySaldo = "SELECT * FROM  tb_saldo WHERE tb_saldo.data BETWEEN '" + datiSaldo.dataFrom + "' AND '"+datiSaldo.dataTo +"' AND  tb_saldo.struttura='" + struttura + "' AND cliente='"+cliente+"'";

    }

    const query = client.query(querySaldo);

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


module.exports = router;