var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./passport-config');
const authMiddleware = require('./authMiddleware');
const usersRouter = require('./routes/users');
const ticketsRouter = require('./routes/tickets');
const loginRouter = require('./routes/login');
const ticketsController = require('./controllers/ticketsController'); 

const app = express();

// Configuración para servir recursos estáticos desde las carpetas "public y datos"
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/datos', express.static(path.join(__dirname, 'datos')));
app.use('/Script', express.static(path.join(__dirname, 'Script')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// configuración del puerto para ingresar al sistema
const PUERTO = 7000;
app.listen(PUERTO, () => {
    console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticación de Passport
app.use((req, res, next) => {
  if (req.isAuthenticated() || req.originalUrl === '/login' || req.originalUrl === '/') {
    return next();
  }

  // Redirige al inicio de sesión si no está autenticado y no es la página de inicio de sesión
  return res.redirect('/login');
});

// Middleware para el rol del usuario
app.use((req, res, next) => {
  res.locals.userRole = req.session.userRole || ''; // Guarda el rol del usuario en res.locals
  next();
});

// Rutas generales del sistema
app.use('/users', usersRouter);
app.use('/tickets', authMiddleware, ticketsRouter);
app.get('/tickets/resultados_busqueda', ticketsController.buscar);
app.use('/', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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