let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/', function(req, res, next) {

    let user = req.session.user;

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT * FROM tb_auth WHERE id='"+user.id+"'";


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

        if(jsonFinale.data.length===1){

            client.end();
            return res.json({errore:false,user:jsonFinale.data[0]});


        }else if(jsonFinale.data.length===0){

            client.end();
            return res.json({errore:true});

        }

    });


});

router.put('/', function(req, res, next) {


});



module.exports = router;