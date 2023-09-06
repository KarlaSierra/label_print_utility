const {con, User} = require('../config/db');
var login = require('../model/login');

module.exports = {

  index: function (req, res) {
    res.render('Inicio');
  },

  crear: function (req, res) {
    res.render('login/users');
  },

  save: function (req, res) {
    login.insertar(con, req.body, function (err, datos) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al insertar los datos en la base de datos');
      }
      res.redirect('ver');
    });

  },

  ver: function (req, res) {
    login.obtener(con, function (err, datos) {
      if (err) {
        // manejar el error aquí
        console.error(err);
        return res.status(500).send('Error al obtener los datos de la base de datos');
      }

      res.render('login/verusuarios', { title: 'Usuarios', usuario1: datos });
    });
  },
}
