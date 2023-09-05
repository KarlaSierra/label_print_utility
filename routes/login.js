const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { User } = require('../config/db');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

router.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

router.use(flash());

//Registro de usuarios
router.get('/', loginController.index);
router.get('/crear', loginController.crear);
router.post('/users', loginController.save);
router.get('/ver', loginController.ver);

router.get('/login', function (req, res) {
  res.render('login/login', { message: req.flash('message') });
});

// Ejemplo en loginRouter.js
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('message', 'Invalid user or password');
      console.log('Intento de inicio de sesión fallido'); // Agregar esta línea para mostrar un intento fallido
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Una vez autenticado el usuario con éxito, obtén el rol del usuario
      const userRole = user.rol;
      console.log('Inicio de sesión exitoso, rol del usuario:', userRole); // Agregar esta línea para mostrar el rol del usuario en el inicio de sesión exitoso
      req.session.userRole = userRole;
      return res.redirect('/tickets');
    });
  })(req, res, next);
});

// Cerrar la sesion
router.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;