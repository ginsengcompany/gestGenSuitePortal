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
    let username = datiRegistrazione.username;
    let password = datiRegistrazione.password;
    let admin = datiRegistrazione.admin;

    let queryAutenticazione = '';

    if(username==='\' or \'\'=\''||password==='\' or \'\'=\''){

        username=null;
        password=null;

    }

    let client = connectionPostgres();

    if(admin === true){
        queryAutenticazione = "SELECT * FROM tb_auth WHERE username='"+username+"' AND password='"+password+"' AND tipo = TRUE";
    }
    else if(admin === false ){
        queryAutenticazione = "SELECT * FROM tb_auth WHERE username='"+username+"' AND password='"+password+"' AND tipo = FALSE";
    }

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