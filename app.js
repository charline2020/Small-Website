// server.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/web/index');
const session = require('express-session');
const mongostore = require('connect-mongo');
const { DBHOST, DBPORT, DBNAME } = require('./config/config');
const app = express();

app.use(session({
    name: 'connect.sid',
    secret: 'Hachi',
    saveUninitialized: false,
    resave: true,
    store: mongostore.create({
        mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    },
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// website page
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render('404');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

port = 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});