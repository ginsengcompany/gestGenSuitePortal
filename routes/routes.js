module.exports = function (app) {

    app.get('/', function (req, res, next) {
        res.render('login');
    });

    app.post('/', function (req, res, next) {

        if (req.body.userAuthenticated && req.body.userAuthenticated === true) {
            req.session.authenticated = true;
            req.session.user = req.body.user;
            res.redirect('/dashboard');
        }

    });

    app.get('/dashboard', function (req, res, next) {
        res.render('index');
    });

    app.get('/clienti', function (req, res, next) {
        res.render('clienti');
    });

    app.get('/inserimento', function (req, res, next) {
        res.render('inserimento');
    });

    app.get('/profilo', function (req, res, next) {
        res.render('profilo');
    });

    app.get('/saldo', function (req, res, next) {
        res.render('saldo');
    });

    app.get('/utenti', function (req, res, next) {
        res.render('utenti');
    });

    app.get('/privacy', function (req, res, next) {
        res.render('privacy');
    });

    app.get('/prodotti', function (req, res, next) {
        res.render('prodotti');
    });

    app.get('/fornitori', function (req, res, next) {
        res.render('fornitori');
    });

    app.get('/logout', function (req, res, next) {
        delete req.session.authenticated;
        res.redirect('/');
    });

};