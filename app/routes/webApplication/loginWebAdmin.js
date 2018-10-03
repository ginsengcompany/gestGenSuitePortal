let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res, next) {

    let datiRegistrazione = req.body;
    let username = datiRegistrazione.username;
    let password = datiRegistrazione.password;

    let queryAutenticazione = '';

    if(username==='\' or \'\'=\''||password==='\' or \'\'=\''){

        username=null;
        password=null;

    }

    let client = connectionPostgres();

    queryAutenticazione = "SELECT * FROM tb_super_administrator WHERE username='"+username+"' AND password='"+password+"'";


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
            return res.json({errore:false,id:jsonFinale.data[0]});


        }else if(jsonFinale.data.length===0){

            client.end();
            return res.json({errore:true});

        }

    });


});



module.exports = router;