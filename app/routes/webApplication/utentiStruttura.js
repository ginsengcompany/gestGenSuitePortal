let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT * FROM tb_auth WHERE struttura='"+user.struttura+"' ";


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
        return res.json(jsonFinale);
    });


});

router.put('/', function(req, res, next) {


});



module.exports = router;