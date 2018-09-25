let  express = require('express');
let  path = require('path');
let  favicon = require('serve-favicon');
let  logger = require('morgan');
let  cookieParser = require('cookie-parser');
let  bodyParser = require('body-parser');
let  moment = require('moment');
let  session = require('express-session');
let cons = require('consolidate');

let  app = express();

moment.locale('it');

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname,'public/images','favicon.ico')));

app.use(logger('dev'));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({secret: "Shh, its a secret!",saveUninitialized: false, resave: false}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + 'public'));

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

function checkAuth (req, res, next) {

    if ((req.url === '/dashboard'  || req.url === '/profilo'  || req.url === '/utenti'  || req.url === '/clienti'  || req.url === '/inserimento' || req.url === '/saldo') && (!req.session || !req.session.authenticated)) {
        res.render('login', { status: 403 });
        return;
    }

    next();
}

app.use(checkAuth);

require('./routes/routes.js')(app);

let loginApp = require('./app/routes/mobileApplication/login');
let salvaSaldo = require('./app/routes/mobileApplication/salvaSaldo');
let salvaSaldoWA = require('./app/routes/webApplication/salvaSaldoWA');
let struttura = require('./app/routes/mobileApplication/struttura');
let getSaldo = require('./app/routes/mobileApplication/getSaldo');
let getSaldoWA = require('./app/routes/webApplication/getSaldoWA');
let cliente = require('./app/routes/mobileApplication/cliente');
let salvaCliente = require('./app/routes/mobileApplication/salvaCliente');
let loginWeb = require('./app/routes/webApplication/login');
let admin = require('./app/routes/webApplication/admin');
let strutturaWeb = require('./app/routes/webApplication/struttura');
let utentiStruttura = require('./app/routes/webApplication/utentiStruttura');

let categoria = require('./app/routes/mobileApplication/categoria');
let fornitore = require('./app/routes/mobileApplication/fornitore');
let prodotti = require('./app/routes/mobileApplication/prodotti');
let invioEmail = require('./app/routes/mobileApplication/invioEmail');

let clienteStruttura = require('./app/routes/webApplication/clienteStruttura');



let swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('./swagger.json');
let swaggerMobile = require('./swaggerMobile.json');

app.use('/loginApp',loginApp);
app.use('/salvaSaldo',salvaSaldo);
app.use('/salvaSaldoWA',salvaSaldoWA);
app.use('/getStruttura',struttura);
app.use('/getSaldo',getSaldo);
app.use('/getSaldoWA',getSaldoWA);
app.use('/cliente',cliente);
app.use('/salvaCliente',salvaCliente);
app.use('/loginWeb',loginWeb);
app.use('/getAdmin',admin);
app.use('/getStrutturaWeb',strutturaWeb);
app.use('/utentiStruttura',utentiStruttura);

app.use('/categoria',categoria);
app.use('/fornitore',fornitore);
app.use('/prodotti',prodotti);
app.use('/invioEmail',invioEmail);


app.use('/clienteStruttura',clienteStruttura);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-mobile', swaggerUi.serve, swaggerUi.setup(swaggerMobile));



app.use(function(req, res, next) {
    let  err = new Error('Not Found');
    err.status = 404;
    res.render('error');
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
