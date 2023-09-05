const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); //modelo

passport.use(new LocalStrategy(
  {
    usernameField: 'username', // Campo del formulario que contendrá el nombre de usuario
    passwordField: 'password', // Campo del formulario que contendrá la contraseña
  },
  async (username, password, done) => {
    try {
      // Buscar al usuario por nombre de usuario en la base de datos
      const user = await User.findOne({ username });

      // Si no se encuentra el usuario, retornar un error
      if (!user) {
        return done(null, false, { message: 'Nombre de usuario incorrecto.' });
      }

      // Comparar la contraseña ingresada con la almacenada en la base de datos
      const isMatch = await bcrypt.compare(password, user.password);

      // Si las contraseñas no coinciden, retornar un error
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }

      // Si el usuario y contraseña son válidos, retornar el usuario
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Buscar al usuario por ID en la base de datos
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;