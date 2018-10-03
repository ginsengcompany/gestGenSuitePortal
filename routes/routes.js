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

    app.get('/administrator', function (req, res, next) {
        res.render('admin');
    });

    app.post('/administrator', function (req, res, next) {

        if (req.body.userAuthenticated && req.body.userAuthenticated === true) {
            req.session.authenticated = true;
            req.session.user = req.body.user;
            res.redirect('/dashboardAdministrator');
        }

    });

    app.get('/dashboard', function (req, res, next) {
        res.render('index');
    });

    app.get('/dashboardAdministrator', function (req, res, next) {
        res.render('dashboardAdministrator');
    });

    app.get('/utentiAdmin', function (req, res, next) {
        res.render('strutture');
    });

    app.get('/strutture', function (req, res, next) {
        res.render('struttureTab');
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

        if(req.query.id==='admin'){
            delete req.session.authenticated;
            res.redirect('/administrator');
        }
        else if(req.query.id==='user'){
            delete req.session.authenticated;
            res.redirect('/');
        }
    });

};